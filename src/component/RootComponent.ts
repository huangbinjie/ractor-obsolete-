import { AbstractActor } from "js-actor"
import { ComponentDidMount } from "../messages/componentDidMount"
import { callChildrenMethod } from "../helper/callChildrenMethod"

// 组件chain的根节点
export class RootComponent extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(ComponentDidMount, () => callChildrenMethod(this.context.children.values(), "didUpdate"))
			.build()
	}
}