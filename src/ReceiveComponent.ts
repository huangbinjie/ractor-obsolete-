import { Receive, ReceiveBuilder } from "js-actor"
import { CompositeComponent } from "./CompositeComponent"
import { DomComponent } from "./DomComponent"
import { CreatedElement } from "./createElement"
import { Component } from "./Component"

export abstract class ReceiveComponent<P, S> extends Component<P, S> {
	public abstract receiveName: string
	public receiveBuilder() {
		return ReceiveBuilder.create()
	}
	public abstract createReceive(): ReceiveBuilder
}