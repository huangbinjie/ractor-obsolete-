import { Component } from "../component/Component"
import { createProperties } from "virtual-dom"

export class Element {
	constructor(
		public type: string | (new () => Component<any, any>),
		public props: createProperties,
		public children: (Element | string | Element[])[]
	) { }
}