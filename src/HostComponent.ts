import { h, createProperties, VNode } from "virtual-dom"
import { CreatedElement } from "./component"

export class HostComponent {
	constructor(private nodeName: string, private props: createProperties, private children: CreatedElement[]) {

	}
	public mount(): VNode {
		const children = this.children.map(child => child.mount())
		return h(this.nodeName, this.props, children)
	}
}