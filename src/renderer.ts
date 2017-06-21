import { ActorSystem } from "js-actor"
import { AbstractActor } from "js-actor"
import { create, diff, patch, VNode } from "virtual-dom"
import { Render } from "./messages/render"
import { ComponentDidMount } from "./messages/componentDidMount"
import { ComponentDidUpdate } from "./messages/componentDidUpdate"
import { CompositeComponent } from "./CompositeComponent"

export const render = (container: Element, root: CompositeComponent) => {
	const app = new ActorSystem("reactor")
	const rootVnode = root.mount()
	const rootNode = create(rootVnode)
	container.appendChild(rootNode)
	const rendererActor = app.actorOf(new Renderer(rootNode, rootVnode), "renderer")
	const rootActor = app.actorOf(root)
	root.renderer = rendererActor
	rootActor.tell(new ComponentDidMount)
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