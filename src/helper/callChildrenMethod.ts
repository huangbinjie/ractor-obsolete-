import { ActorRef } from "js-actor"
import { CompositeComponent } from "../CompositeComponent"

type Method = "didMount" | "didUpdate"

export function callChildrenMethod(children: IterableIterator<ActorRef>, method: Method) {
	for (let child of children) {
		const childActor = (child.getActor() as CompositeComponent).instanceComponent[method]()
		callChildrenMethod(child.getContext().children.values(), method)
	}
}