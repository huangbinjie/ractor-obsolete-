import { AbstractActor } from "js-actor"
import { createProperties, VNode } from "virtual-dom"
import { Component } from "./component"
import { CreatedElement } from "./component"
import { Render } from "./renderer"

export class CompositeComponent extends AbstractActor {
	private instanceComponent: Component<any, any>
	public createReceive() {
		return this.receiveBuilder().build()
	}

	constructor(private componentClass: new () => Component<any, any>, private props: createProperties, private children: CreatedElement[]) {
		super()
	}
	public mount(): VNode {
		this.instanceComponent = new this.componentClass()
		this.instanceComponent.props = this.props
		this.instanceComponent.setState = (nextState: object) => {
			Object.assign(this.instanceComponent.state, nextState)
			const vnode = this.instanceComponent.render().mount()
			this.context.system.dispatch("renderer", new Render(vnode))
		}
		let element = this.instanceComponent.render()
		if (element instanceof CompositeComponent) {
			this.context.actorOf(element)
		}
		return element.mount()
	}
}