import { ActorSystem } from "js-actor"
import { AbstractActor } from "js-actor"
import { create, diff, patch, VNode } from "virtual-dom"
import { Render } from "./messages/render"
import { ComponentDidMount } from "./messages/componentDidMount"
import { ComponentDidUpdate } from "./messages/componentDidUpdate"
import { CompositeComponent } from "./component/CompositeComponent"
import { Element as VirtualElement } from "./element/Element"
import { mount } from "./helper/mount"
import { callChildrenMethod } from "./helper/callChildrenMethod"


export const render = (container: Element, rootElement: VirtualElement) => {
	const app = new ActorSystem("ractor")
	const renderer = new Renderer
	const rendererActor = app.actorOf(renderer, "@@renderer")
	const rootVNode = mount(rootElement, app.getRoot(), rendererActor)
	const rootNode = create(rootVNode)
	container.appendChild(rootNode)
	renderer.container = rootNode
	renderer.rootVNode = rootVNode
	callChildrenMethod(app.getRoot().getContext().children.values(), "didMount")
}

export class Renderer extends AbstractActor {
	public container: Element
	public rootVNode: VNode
	public createReceive() {
		return this.receiveBuilder()
			.match(Render, render => {
				console.log(render.newVnode)
				const patches = diff(this.rootVNode, render.newVnode)
				this.container = patch(this.container, patches);
				this.getSender()!.tell(new ComponentDidUpdate)
			})
			.build()
	}
}