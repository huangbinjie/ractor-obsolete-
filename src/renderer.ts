import { ActorSystem } from "js-actor"
import { AbstractActor } from "js-actor"
import { create, diff, patch, VNode, VTree } from "virtual-dom"
import * as Ractor from "./"

import { CompositeComponent } from "./CompositeComponent"

export const render = (container: Element, root: CompositeComponent) => {
	const app = new ActorSystem("reactor")
	const rendererActor = app.actorOf(new Renderer(container), "renderer")
	app.actorOf(root)
	const rootVnode = root.mount()
	rendererActor.tell(new Render(rootVnode))
}

export class Renderer extends AbstractActor {
	private vtree: VTree
	public createReceive() {
		return this.receiveBuilder()
			.match(Render, render => {
				if (this.vtree) {
					const patches = diff(this.vtree, render.newVnode)
					this.container = patch(this.container, patches)
				} else {
					this.container = create(render.newVnode)
				}
			})
			.build()
	}
	constructor(private container: Element) {
		super()
	}
}

export class Render {
	constructor(public newVnode: VNode) { }
}