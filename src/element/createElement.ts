import { AbstractActor } from "js-actor"
import { h, diff, patch, create, createProperties, VNode } from "virtual-dom"

import { Component } from "../component/Component"
import { Element } from "./Element"

export function createElement(nodeName: string | (new () => Component<any, any>), props = {} as createProperties, ...children: (Element | string)[]) {
	return new Element(nodeName, props, children)
}
