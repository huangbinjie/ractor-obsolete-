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
			// if (children.length === 1 && typeof children[0] !== "function") return h("span", props, children as [string])
			const flattenedChildren = children.reduce<(VNode | Element)[]>((acc, child) => [...acc, ...Array.isArray(child) ? child : [child]], [])
			const childs = [...this.context.children.values()]
				.map(child => child.getActor())
				.map((child: CompositeComponent | DomComponent, i) => {
					// if (typeof flattenedChildren[i] === "string") return h("span", {}, flattenedChildren[i] as string)
					return child.render(flattenedChildren[i] as Element)
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