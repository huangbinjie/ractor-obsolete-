import { AbstractActor, ActorRef } from "js-actor"
import { Element } from "../element/Element"
import { Component } from "../component/Component"
import { CompositeComponent } from "../component/CompositeComponent"
import { DomComponent } from "../component/DomComponent"
import { TextComponent } from "../component/TextComponent"

export function mount(elements: string, parent: ActorRef): Text
export function mount(elements: Element, parent: ActorRef): HTMLElement
export function mount(elements: Element[], parent: ActorRef): HTMLElement[]
export function mount(elements: string | Element, parent: ActorRef): Text | HTMLElement
export function mount(elements: string | Element | Element[], parent: ActorRef) {
	if (typeof elements === "string") {
		return mountText(elements, parent)
	}

	if (Array.isArray(elements)) {
		return elements.map(element => mount(element, parent))
	}

	if (typeof elements.type === "function") {
		return mountComposite(elements, parent)
	} else {
		return mountHost(elements, parent)
	}
}

function mountComposite(element: Element, parent: ActorRef): HTMLElement {
	const component = new CompositeComponent(element)
	const actor = parent.getContext().actorOf(component)
	component.instantiatedComponent.willMount()
	const el = mount(component.renderedElement, actor)
	component.instantiatedComponent.didMount()
	return el
}

function mountHost(element: Element, parent: ActorRef): HTMLElement {
	const el = document.createElement(element.type as string)
	;(parent.getActor() as CompositeComponent | DomComponent).dom = el
	const domComponent = new DomComponent(el, element)
	const actor = parent.getContext().actorOf(domComponent)
	element.children
		// .reduce<(string | Element)[]>((acc, child) => [...acc, ...Array.isArray(child) ? child : [child]], [])
		.map(child => {
			if (Array.isArray(child)) {
				return child.map(grandchild => el.appendChild(mount(grandchild, actor)))
			}
			return el.appendChild(mount(child, actor))
		})
	return el
}

function mountText(text: string, parent: ActorRef) {
	const dom = document.createTextNode(text)
	parent.getContext().actorOf(new TextComponent(dom, text))
	return dom
}