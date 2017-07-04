import { AbstractActor, ActorRef } from "js-actor"
import { h, VNode } from "virtual-dom"
import { Element } from "../element/Element"
import { Component } from "./Component"
import { DomComponent } from "./DomComponent"
import { ReceiveComponent } from "./ReceiveComponent"

import { ComponentDidMount } from "../messages/componentDidMount"
import { ComponentDidUpdate } from "../messages/componentDidUpdate"
import { Render } from "../messages/render"

import { mount } from "../helper/mount"
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
		const receiveBuilder = this.instantiatedComponent instanceof ReceiveComponent ?
			this.instantiatedComponent.createReceive() : this.receiveBuilder()
		return receiveBuilder
			.match(ComponentDidUpdate, () => {
				this.instantiatedComponent.didUpdate()
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

		this.instantiatedComponent.props = props

		this.renderedElement = this.instantiatedComponent.render()

		if (this.instantiatedComponent instanceof ReceiveComponent) {
			this.name = this.instantiatedComponent.receiveName
		}

		this.instantiatedComponent.setState = (nextState: object, callback = () => { }) => {
			// setstate 部分需要根据此函数判断是否刷新
			if (!this.instantiatedComponent.shouldUpdate(this.instantiatedComponent.props, nextState)) return
			Object.assign(this.instantiatedComponent.state, nextState)
			const vnode = this.render(this.element)
			this.renderer.tell(new Render(vnode), this.getSelf())
			callback()
		}

		this.instantiatedComponent.dispatch = (name: string, message: object) => this.context.system.dispatch(name, message)

		this.instantiatedComponent.willMount()
	}

	public unmount() {
		this.context.stop()
	}
	/** 
	 *  setState: render(<Todo />)
	 * 
	 *  如果子节点类型没变，比如 (<div>Header</div>).render(<Header />)，那么刷新dom
	 * 
	 *  如果子节点类型变了，比如<div><Header /></div>变成<div><List /></div>，则复用当前节点(actor)，
	 *  卸载所有子节点，然后重新mount新节点。
	 *  
	 *  如果3个子元素变成2个，那么会render(undefined)，需要unmount这个actor。
	 */
	public render(nextElement: Element): VNode {
		if (!nextElement) this.unmount()

		const child = this.context.children.values().next().value.getActor() as CompositeComponent | DomComponent
		this.instantiatedComponent.props = nextElement.props
		const nextRenderedElement = this.instantiatedComponent.render()

		if (this.element.type === nextElement.type) {
			const nextVNode = child.render(nextRenderedElement)
			this.renderedElement = nextRenderedElement
			return nextVNode
		} else {
			this.instantiateComponent(nextRenderedElement)
			child.unmount()
			return mount(nextRenderedElement, this.getSelf(), this.renderer)
		}
	}

	// public mount() {
	// 	const { type, props, children } = this.renderedElement
	// 	if (typeof type === "string") {
	// 		const childs = children.map(child => {

	// 		})
	// 	} else {

	// 	}
	// }
}
