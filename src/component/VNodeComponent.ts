import { AbstractActor, ActorRef } from "js-actor"
import { h, VNode, createProperties } from "virtual-dom"
import { Element } from "../element/Element"
import { CompositeComponent } from "./CompositeComponent"
import { mount } from "../helper/mount"

export class VNodeComponent extends AbstractActor {
	constructor(private vnode: VNode) { super() }
	public createReceive() {
		return this.receiveBuilder().build()
	}

	public render(vnode: VNode): VNode {
		return vnode
	}

	public unmount() {
		this.context.stop()
	}
}