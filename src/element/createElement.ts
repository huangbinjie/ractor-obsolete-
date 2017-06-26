import { AbstractActor } from "js-actor"
import { h, diff, patch, create, createProperties, VNode } from "virtual-dom"

import { Component } from "../component/Component"
import { Element } from "./Element"

export function createElement(nodeName: string | (new () => Component<any, any>), props = {} as createProperties, ...children: (Element | string)[]) {
	const childs = children.map(child => {
		if (child instanceof Element) return child
		return h("span", {}, String(child))
	})
	return new Element(nodeName, props, childs)
}