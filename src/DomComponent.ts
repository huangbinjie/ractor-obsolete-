// import { AbstractActor, ActorRef } from "js-actor"
// import { h, createProperties, VNode } from "virtual-dom"
// import { CreatedElement } from "./createElement"
// import { CompositeComponent } from "./CompositeComponent"

// export class DomComponent extends AbstractActor {
// 	constructor(private nodeName: string, private props: createProperties, private children: CreatedElement[]) { super() }
// 	public createReceive() {
// 		return this.receiveBuilder().build()
// 	}
// 	public mount(parent: AbstractActor): VNode {
// 		const children = this.children.map(child => {
// 			if (child instanceof DomComponent || child instanceof CompositeComponent) return child.mount(parent)
// 			if (Array.isArray(child)) return child.map(grandchild => grandchild.mount(parent))
// 			return child
// 		})
// 		// console.log(children)
// 		return h(this.nodeName, this.props, children)
// 	}
// }