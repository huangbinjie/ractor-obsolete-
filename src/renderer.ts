import { ActorSystem } from "js-actor"
import { AbstractActor } from "js-actor"
import { create, diff, patch, VNode } from "virtual-dom"
import { Render } from "./messages/render"
import { ComponentDidMount } from "./messages/componentDidMount"
import { ComponentDidUpdate } from "./messages/componentDidUpdate"
import { CompositeComponent } from "./component/CompositeComponent"
import { Element as VirtualElement } from "./element/Element"
import { mount } from "./helper/mount"
import { callChildrenMethod } from "./helper/callChildrenMethod"


export const render = (container: Element, rootElement: VirtualElement) => {
	const app = new ActorSystem("ractor")
	mount(rootElement, app.getRoot())
}