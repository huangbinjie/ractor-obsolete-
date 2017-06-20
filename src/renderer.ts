import { ActorSystem } from "js-actor"
import { AbstractActor } from "js-actor"
import { create, diff, patch, VNode, VTree } from "virtual-dom"
import * as Ractor from "./"

import { CompositeComponent } from "./CompositeComponent"

export const render = (container: Element, root: CompositeComponent) => {
	const app = new ActorSystem("reactor")
	const rootVnode = root.mount()
	const rootNode = create(rootVnode)
	container.appendChild(rootNode)
	const rendererActor = app.actorOf(new Renderer(rootNode, rootVnode), "renderer")
	app.actorOf(root)
}

export class Renderer extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(Render, render => {
				const patches = diff(this.rootNode, render.newVnode)
				this.container = patch(this.container, patches)
			})
			.build()
	}
	constructor(private container: Element, private rootNode: VNode) {
		super()
	}
}

export class Render {
	constructor(public newVnode: VNode) { }
}