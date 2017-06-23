import { AbstractActor, ActorRef } from "js-actor"
import { h, VNode } from "virtual-dom"
import { Element } from "../element/Element"
import { Component } from "./Component"
import { ReceiveComponent } from "./ReceiveComponent"

import { ComponentDidMount } from "../messages/componentDidMount"
import { ComponentDidUpdate } from "../messages/componentDidUpdate"
import { Render } from "../messages/render"

import { mount, mountHost } from "../helper/mount"
import { callChildrenMethod } from "../helper/callChildrenMethod"

export class CompositeComponent extends AbstractActor {
	// 节点名称，如果是空则js-actor会随机生成
	public name?: string
	public renderer: ActorRef
	public instantiatedComponent: Component<any, any>
	constructor(private element: Element) {
		super()
		const componentClass = this.element.type as new () => Component<any, any>
		const props = this.element.props
		const children = this.element.children

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
			const childElement = this.element.children[0] as Element
			// 如果子节点没有变，则更新，如果有变则重新刷新 actor 树重新 mount
			if (childElement.type === nextElement.type) {
				this.update(nextElement)
			} else {
				for (let child of this.context.children.values()) {
					child.getContext().stop()
				}
				mount(nextElement, this.getSelf())
			}
			// const vnode = this.update(nextElement)
			// this.renderer.tell(new Render(vnode), this.getSelf())
			// callback()
		}

		this.instantiatedComponent.dispatch = this.context.system.dispatch.bind(this.context.system)

		this.instantiatedComponent.willMount()
	}
	public createReceive() {
		return this.receiveBuilder()
			.match(ComponentDidUpdate, () => {
				this.instantiatedComponent!.didUpdate()
				callChildrenMethod(this.context.children.values(), "didUpdate")
			})
			.build()
	}

	// 生成vnode
	public update(nextElement: Element) {
		this.instantiatedComponent.receiveProps(this.instantiatedComponent.props, nextElement.props)

		// render
		if (typeof nextElement.type === "function") {
			nextElement.type.prototype.render()
		}
	}

	public unmount() { }
}
