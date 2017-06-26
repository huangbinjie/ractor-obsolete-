import { ActorRef } from "js-actor"
import { CompositeComponent } from "../component/CompositeComponent"

type Method = "didMount" | "didUpdate"

export function callChildrenMethod(children: IterableIterator<ActorRef>, method: Method) {
	for (let child of children) {
		let childActor = child.getActor()
		if (childActor instanceof CompositeComponent) childActor.instantiatedComponent[method]()
		callChildrenMethod(child.getContext().children.values(), method)
	}
}