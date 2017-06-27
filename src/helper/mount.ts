import { AbstractActor, ActorRef } from "js-actor"
import { h, VNode } from "virtual-dom"
import { Element } from "../element/Element"
import { Component } from "../component/Component"
import { CompositeComponent } from "../component/CompositeComponent"
import { DomComponent } from "../component/DomComponent"
import { VNodeComponent } from "../component/VNodeComponent"

export function mount(elements: Element, parent: ActorRef, renderer: ActorRef): VNode {
	if (typeof elements.type === "function") {
		return mountComposite(elements, parent, renderer)
	} else {
		return mountHost(elements, parent, renderer)
	}
}

export function mountComposite(element: Element, parent: ActorRef, renderer: ActorRef): VNode {
	const component = new CompositeComponent(element, renderer)
	const actor = parent.getContext().actorOf(component, component.name)
	return mount(component.renderedElement, actor, renderer)
}

export function mountHost(element: Element, parent: ActorRef, renderer: ActorRef): VNode {
	const domComponent = new DomComponent(element, renderer)
	const actor = parent.getContext().actorOf(domComponent)
	const children = element.children.map(child => {
		if (child instanceof Element) return mount(child, actor, renderer)
		if (Array.isArray(child)) return child.map(grandchild => mount(grandchild, actor, renderer))
		actor.getContext().actorOf(new VNodeComponent(child))
		return child
	})
	return h(element.type as string, element.props, children)
}