import { AbstractActor } from "js-actor"
import { h, diff, patch, create, createProperties, VNode } from "virtual-dom"

import { Component } from "./component"
import { CompositeComponent } from "./CompositeComponent"
import { DomComponent } from "./DomComponent"

export function createElement(nodeName: string | (new () => Component<any, any>), props = {} as createProperties, ...children: CreatedElement[]) {
	if (typeof nodeName === "string") {
		return new DomComponent(nodeName, props, children)
	}
	return new CompositeComponent(nodeName, props, children)
}

export type CreatedElement = CompositeComponent | DomComponent