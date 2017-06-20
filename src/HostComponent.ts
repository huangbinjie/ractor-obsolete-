import { h, createProperties, VNode } from "virtual-dom"
import { CreatedElement } from "./component"
import { CompositeComponent } from "./CompositeComponent"

export class HostComponent {
	constructor(private nodeName: string, private props: createProperties, private children: (CreatedElement & object)[]) {
		// this.props = Object.keys(props).map
	}
	public mount(): VNode {
		const children = this.children.map(child => {
			if (child instanceof HostComponent || child instanceof CompositeComponent) return child.mount()
			return child
		})
		return h(this.nodeName, this.props, children)
	}
}