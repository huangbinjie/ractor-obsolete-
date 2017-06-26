import { AbstractActor, ActorRef } from "js-actor"
import { h, VNode } from "virtual-dom"
import { Element } from "../element/Element"
import { Component } from "./Component"
import { DomComponent } from "./DomComponent"
import { ReceiveComponent } from "./ReceiveComponent"

import { ComponentDidMount } from "../messages/componentDidMount"
import { ComponentDidUpdate } from "../messages/componentDidUpdate"
import { Render } from "../messages/render"

import { mount, mountHost } from "../helper/mount"
import { callChildrenMethod } from "../helper/callChildrenMethod"

export class CompositeComponent extends AbstractActor {
	// 节点名称，如果是空则js-actor会随机生成
	public name?: string
	public renderedElement: Element
	public instantiatedComponent: Component<any, any>
	constructor(private element: Element, private renderer: ActorRef) {
		super()
		this.instantiateComponent(element)
	}
	public createReceive() {
		return this.receiveBuilder()
			.match(ComponentDidUpdate, () => {
				this.instantiatedComponent!.didUpdate()
				callChildrenMethod(this.context.children.values(), "didUpdate")
			})
			.build()
	}

	public instantiateComponent(element: Element) {
		const componentClass = element.type as new () => Component<any, any>
		const props = element.props
		const children = element.children
		// 初始化实例
		this.instantiatedComponent = new componentClass

		if (this.instantiatedComponent instanceof ReceiveComponent) {
			this.name = this.instantiatedComponent.receiveName
		}

		this.instantiatedComponent.props = props

		this.instantiatedComponent.setState = (nextState: object, callback = () => { }) => {
			// setstate 部分需要根据此函数判断是否刷新
			if (!this.instantiatedComponent.shouldUpdate(this.instantiatedComponent.props, nextState)) return
			Object.assign(this.instantiatedComponent.state, nextState)
			const nextElement = this.instantiatedComponent.render()
			// 组件的子节点必然是 其他组件或者dom节点，并且只有一个,不用考虑string情况
			const vnode = this.render(nextElement)
			this.renderer.tell(new Render(vnode), this.getSelf())
			callback()
		}

		this.instantiatedComponent.dispatch = (name: string, message: object) => this.context.system.dispatch(name, message)

		this.instantiatedComponent.willMount()
	}

	public unmount() {
		this.context.stop()
	}

	public render(nextElement: Element): VNode {
		if (this.renderedElement.type === nextElement.type) {
			const child = this.context.children.values().next().value.getActor() as CompositeComponent | DomComponent
			return child.render(nextElement)
		} else {
			const child = this.context.children.values().next().value.getActor() as CompositeComponent | DomComponent
			child.unmount()
			this.renderedElement = nextElement
			this.instantiateComponent(nextElement)
			return mount(nextElement, this.getSelf(), this.renderer)
		}
	}
}
