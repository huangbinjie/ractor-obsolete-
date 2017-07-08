import { AbstractActor, ActorRef } from "js-actor"
import { h, VNode, createProperties } from "virtual-dom"
import { Element } from "../element/Element"
import { CompositeComponent } from "./CompositeComponent"
import { TextComponent } from "./TextComponent"
import { mount } from "../helper/mount"

export class DomComponent extends AbstractActor {
	public key?: number
	constructor(public dom: HTMLElement, public renderedElement: Element) { super() }

	public replaceChild(newActor: AbstractActor, oldActor: ActorRef) {
		const newRef = new ActorRef(newActor, this.context.system, oldActor.name, this.context.self, oldActor.getContext().path)
		this.context.children.set(oldActor.name, newRef)
		oldActor.getContext().stop()
		newActor.receive()
	}

	/** DomComponent 的 nextElement 对应的是自己，CompositeComponent 的 nextElement 对应的是 render() 的返回值 */
	public render(nextElement: Element) {
		const { type, props, children } = nextElement
		// 如果节点没变，则更新属性，然后让子组件依次render
		if (this.renderedElement.type === type) {
			// 删除属性
			Object.keys(this.renderedElement.props).forEach(prop => {
				if (prop !== "children" && !Object.prototype.hasOwnProperty.call(props, prop)) {
					this.dom.removeAttribute(prop)
				}
			})

			// 设置新的属性
			Object.keys(props).forEach(prop => {
				if (prop !== 'children') {
					this.dom.setAttribute(prop, props[prop])
				}
			})
			const childrenValues = this.context.children.values()
			children.forEach(child => {
				childrenValues.next().value
				mount(child, this.getSelf())
			})
			this.context.children.forEach((child, i) => {
				let component = child.getActor() as CompositeComponent | DomComponent | TextComponent
				diff(nextElement)
			})
			for (let child of this.context.children.values()) {
				let component = child.getActor() as CompositeComponent | DomComponent | TextComponent
				const el = children.shift()!
				component.render(el)
			}
		} else {
		}
	}

	public unmount() {
		this.context.stop()
	}
}

function diff(parent: DomComponent, parentDom: HTMLElement, el: string | Element | Element[], actor?: CompositeComponent | DomComponent | TextComponent) {
	if (typeof el === "string") {
		if (actor instanceof TextComponent) {
			actor.render(el)
		} else {
			const textNode = document.createTextNode(el)
			const textComponent = new TextComponent(textNode, el)
			if (actor) {
				// 存在， 替换actor
				parent.replaceChild(textComponent, actor.context.self)

				parentDom.replaceChild(textNode, actor.dom)
			} else {
				parentDom.appendChild(textNode)
				parent.context.actorOf(textComponent)
			}
		}
	}

	if (el instanceof Element) {
		if (typeof el.type === "string") {
			const dom = document.createElement(el.type)
			const domComponent = new DomComponent(dom, el)
			if (actor) {
				parent.replaceChild(domComponent, actor.context.self)

				parentDom.replaceChild(dom, actor.dom)
			} else {
				parentDom.appendChild(dom)
				parent.context.actorOf(domComponent)
			}
		}

		if (el.type instanceof CompositeComponent) {
			const compositeComponent = new CompositeComponent(el)
			if (actor) {
				parent.replaceChild(compositeComponent, actor.context.self)

				parentDom.replaceChild(dom, actor.dom)
			} else {
				parentDom.appendChild(dom)
				parent.context.actorOf(domComponent)
			}
		}
	}
}