import { AbstractActor, ActorRef } from "js-actor"
import { h, VNode } from "virtual-dom"
import { Element } from "../element/Element"
import { Component } from "../component/Component"
import { CompositeComponent } from "../component/CompositeComponent"

export function mount(elements: Element, parent: ActorRef): VNode {
	if (typeof elements.type === "function") {
		return mountComposite(elements, parent)
	} else {
		return mountHost(elements, parent)
	}
}

export function mountComposite(element: Element, parent: ActorRef): VNode {
	const component = new CompositeComponent(element)
	parent.getContext().actorOf(component)
	return mount(component.instantiatedComponent.render(), parent)
}

export function mountHost(element: Element, parent: ActorRef): VNode {
	const children = element.children.map(child => {
		if (child instanceof Element) return mount(child, parent)
		if (Array.isArray(child)) return child.map(grandchild => mount(grandchild, parent))
		return child
	})
	return h(element.type as string, element.props, children)
}