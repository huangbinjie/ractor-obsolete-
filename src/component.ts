import { AbstractActor } from "js-actor"
import { createElement } from "./createElement"
import { VNode, createProperties } from "virtual-dom"
import { CompositeComponent } from "./CompositeComponent"
import { HostComponent } from "./HostComponent"

export abstract class Component<P, S> {
	public state: S
	public props: P
	abstract render(): CreatedElement
	public setState(newState: Partial<S>) { }
	protected createElement = createElement
}

export type CreatedElement = CompositeComponent | HostComponent