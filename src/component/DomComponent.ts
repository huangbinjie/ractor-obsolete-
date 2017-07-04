import { AbstractActor, ActorRef } from "js-actor"
import { h, VNode, createProperties } from "virtual-dom"
import { Element } from "../element/Element"
import { CompositeComponent } from "./CompositeComponent"
import { mount } from "../helper/mount"

export class DomComponent extends AbstractActor {
	constructor(private element: Element, private renderer: ActorRef) { super() }
	public createReceive() {
		return this.receiveBuilder().build()
	}

	public render(nextElement: Element): VNode {
		const { type, props, children } = nextElement
		if (this.element.type === type) {
			const flattenedChildren = children.reduce<(string | Element)[]>((acc, child) => [...acc, ...Array.isArray(child) ? child : [child]], [])
			if (this.context.children.size !== flattenedChildren.length) {
				for (let child of this.context.children.values()) {
					(child.getActor() as DomComponent).unmount()
				}
				mount(children, this.getSelf(), this.renderer)
				return mount(nextElement, this.getSelf(), this.renderer)
			}

			const childs = [...this.context.children.values()]
				.map(child => child.getActor())
				.map((child: CompositeComponent | DomComponent, i) => {
					const el = flattenedChildren[i] as Element
					if (child instanceof CompositeComponent) child.instantiatedComponent.receiveProps(el.props)
					return child.render(el)
				})
			return h(type as string, props, childs)
		} else {
			for (let child of this.context.children.values()) {
				child.getContext().stop()
			}
			this.element = nextElement
			return mount(nextElement, this.getSelf(), this.renderer)
		}
	}

	public unmount() {
		this.context.stop()
	}
}