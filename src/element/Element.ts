import { Component } from "../component/Component"
import { createProperties, VNode } from "virtual-dom"

export class Element {
	constructor(
		public type: string | (new () => Component<any, any>),
		// TODO: props type
		public props: { [key: string]: any },
		public children: (string | Element | Element[])[]
	) { }
}
