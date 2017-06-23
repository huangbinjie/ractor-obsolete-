import { ActorSystem } from "js-actor"
import { AbstractActor } from "js-actor"
import { create, diff, patch, VNode } from "virtual-dom"
import { Render } from "./messages/render"
import { ComponentDidMount } from "./messages/componentDidMount"
import { ComponentDidUpdate } from "./messages/componentDidUpdate"
import { CompositeComponent } from "./component/CompositeComponent"
import { Element as VirtualElement } from "./element/Element"
import { mount } from "./helper/mount"


export const render = (container: Element, rootElement: VirtualElement) => {
	const app = new ActorSystem("ractor")
	const rootVNode = mount(rootElement, app.getRoot())
	const rootNode = create(rootVNode)
	const rendererActor = app.actorOf(new Renderer(rootNode, rootVNode), "@@renderer")
	container.appendChild(rootNode)
}

export class Renderer extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(Render, render => {
				const patches = diff(this.rootNode, render.newVnode)
				this.container = patch(this.container, patches);
				this.getSender()!.tell(new ComponentDidUpdate)
			})
			.build()
	}
	constructor(private container: Element, private rootNode: VNode) {
		super()
	}
}