import { Component } from "../component/Component"
import { createProperties, VNode } from "virtual-dom"

export class Element {
	constructor(
		public type: string | (new () => Component<any, any>),
		public props: createProperties,
		public children: (VNode | Element | Element[])[]
	) { }
}