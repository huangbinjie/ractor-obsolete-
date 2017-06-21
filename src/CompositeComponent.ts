import { AbstractActor, ActorRef } from "js-actor"
import { createProperties, VNode } from "virtual-dom"
import { Component } from "./Component"
import { ReceiveComponent } from "./ReceiveComponent"
import { CreatedElement } from "./createElement"
import { Render } from "./messages/render"
import { ComponentDidMount } from "./messages/componentDidMount"
import { ComponentDidUpdate } from "./messages/componentDidUpdate"

import { callChildrenMethod } from "./helper/callChildrenMethod"

export class CompositeComponent extends AbstractActor {
	public renderer: ActorRef
	public instanceComponent: Component<any, any>
	public createReceive() {
		// 如果是 receiveComponent 要接收它的匹配规则
		if (this.instanceComponent instanceof ReceiveComponent) {
			return this.instanceComponent.createReceive()
				.match(ComponentDidMount, () => {
					this.instanceComponent.didMount()
					callChildrenMethod(this.context.children.values(), "didMount")
				})
				.match(ComponentDidUpdate, () => {
					this.instanceComponent.didUpdate()
					callChildrenMethod(this.context.children.values(), "didUpdate")
				})
				.build()
		}
		// 默认匹配规则，一些生命周期消息
		return this.receiveBuilder()
			.match(ComponentDidMount, () => {
				this.instanceComponent.didMount()
				callChildrenMethod(this.context.children.values(), "didMount")
			})
			.match(ComponentDidUpdate, () => {
				this.instanceComponent.didUpdate()
				callChildrenMethod(this.context.children.values(), "didUpdate")
			})
			.build()
	}

	constructor(componentClass: new () => Component<any, any>, private props: createProperties, private children: CreatedElement[]) {
		super()
		this.instanceComponent = new componentClass()
	}
	public mount(): VNode {
		this.instanceComponent.props = this.props
		this.instanceComponent.setState = (nextState: object, callback = () => { }) => {
			Object.assign(this.instanceComponent.state, nextState)
			const vnode = this.instanceComponent.render().mount()
			this.renderer.tell(new Render(vnode), this.getSelf())
			callback()
		}
		this.instanceComponent.dispatch = () => this.context.system.dispatch
		this.instanceComponent.willMount()
		let element = this.instanceComponent.render()
		if (element instanceof CompositeComponent) {
			this.context.actorOf(element)
			element.renderer = this.renderer
		}
		return element.mount()
	}
}