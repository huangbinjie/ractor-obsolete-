import { h, createProperties, VNode } from "virtual-dom"
import { CreatedElement } from "./createElement"
import { CompositeComponent } from "./CompositeComponent"

export class DomComponent {
	constructor(private nodeName: string, private props: createProperties, private children: (CreatedElement & object)[]) { }
	public mount(): VNode {
		const children = this.children.map(child => {
			if (child instanceof DomComponent || child instanceof CompositeComponent) return child.mount()
			return child
		})
		return h(this.nodeName, this.props, children)
	}
}