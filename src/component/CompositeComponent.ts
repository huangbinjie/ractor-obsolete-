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
	public renderedElement: Element
	public dom: HTMLElement
	public instantiatedComponent: Component<any, any>
	constructor(private element: Element) {
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

	// public getDom() {
	// 	if (typeof this.renderedElement.type === "function") {
	// 		const childActor = this.context.children.values().next().value.getActor() as CompositeComponent | DomComponent
	// 		if (childActor instanceof CompositeComponent) {
	// 			return childActor.getDom()
	// 		} else {
	// 			return childActor.dom
	// 		}
	// 	}
	// 	return this.renderedElement
	// }

	public replaceChild(newActor: AbstractActor, oldActor: ActorRef) {
		const newRef = new ActorRef(newActor, this.context.system, oldActor.name, this.context.self, oldActor.getContext().path)
		this.context.children.set(oldActor.name, newRef)
		oldActor.getContext().stop()
		newActor.receive()
	}

	public instantiateComponent(element: Element) {
		const componentClass = element.type as new () => Component<any, any>
		const props = element.props
		const children = element.children
		// 初始化实例
		this.instantiatedComponent = new componentClass

		this.instantiatedComponent.props = props

		this.renderedElement = this.instantiatedComponent.render()

		this.instantiatedComponent.setState = (nextState: object, callback = () => { }) => {
			// setstate 部分需要根据此函数判断是否刷新
			if (!this.instantiatedComponent.shouldUpdate(this.instantiatedComponent.props, nextState)) return
			Object.assign(this.instantiatedComponent.state, nextState)
			this.instantiatedComponent.willUpdate(this.instantiatedComponent.props)
			const vnode = this.render(this.instantiatedComponent.render())
			callback()
		}

		this.instantiatedComponent.dispatch = (name: string, message: object) => this.context.system.dispatch(name, message)
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
	public render(nextElement: Element) {
		if (!nextElement) this.unmount()

		const child = this.context.children.values().next().value.getActor() as CompositeComponent | DomComponent
		this.instantiatedComponent.props = nextElement.props
		if (this.renderedElement.type === nextElement.type) {
			child.render(child.renderedElement)
			this.renderedElement = nextElement
		} else {
			// 如果类型不同卸载重新初始化组件，卸载虚拟节点，重新生成子节点
			this.instantiateComponent(nextElement)
			child.unmount()
			mount(nextElement, this.getSelf())
		}
	}
}
