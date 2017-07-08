import { AbstractActor, ActorRef } from "js-actor"
import { h, VNode, createProperties } from "virtual-dom"
import { Element } from "../element/Element"
import { CompositeComponent } from "./CompositeComponent"
import { mount } from "../helper/mount"

export class TextComponent extends AbstractActor {
	constructor(public dom: Text, public renderedElement: string) { super() }

	public render(nextText: string) {
		if (this.dom.textContent !== nextText) {
			this.dom.textContent = nextText
		}
	}

	public unmount() {
		this.context.stop()
	}
}