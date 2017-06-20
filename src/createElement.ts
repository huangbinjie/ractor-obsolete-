import { AbstractActor } from "js-actor"
import { h, diff, patch, create, createProperties, VNode } from "virtual-dom"

import { Component, CreatedElement } from "./component"
import { CompositeComponent } from "./CompositeComponent"
import { HostComponent } from "./HostComponent"

export function createElement(nodeName: string | (new () => Component<any, any>), props = {} as createProperties, ...children: CreatedElement[]) {
	if (typeof nodeName === "string") {
		return new HostComponent(nodeName, props, children)
	}
	return new CompositeComponent(nodeName, props, children)
}

function createElementActor() {
	return class ElementActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder().build()
		}
	}
}