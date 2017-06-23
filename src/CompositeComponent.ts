// import { AbstractActor, ActorRef } from "js-actor"
// import { createProperties, VNode } from "virtual-dom"
// import { Component } from "./Component"
// import { ReceiveComponent } from "./ReceiveComponent"
// import { CreatedElement } from "./createElement"
// import { Render } from "./messages/render"
// import { ComponentDidMount } from "./messages/componentDidMount"
// import { ComponentDidUpdate } from "./messages/componentDidUpdate"

// import { callChildrenMethod } from "./helper/callChildrenMethod"

// export class CompositeComponent extends AbstractActor {
// 	public name?: string
// 	public renderer: ActorRef
// 	public _mounted = false
// 	public instanceComponent: Component<any, any>
// 	public createReceive() {
// 		// 如果是 receiveComponent 要接收它的匹配规则
// 		if (this.instanceComponent instanceof ReceiveComponent) {
// 			return this.instanceComponent.createReceive()
// 				.match(ComponentDidUpdate, () => {
// 					this.instanceComponent.didUpdate()
// 					callChildrenMethod(this.context.children.values(), "didUpdate")
// 				})
// 				.build()
// 		}
// 		// 默认匹配规则，一些生命周期消息
// 		return this.receiveBuilder()
// 			.match(ComponentDidUpdate, () => {
// 				this.instanceComponent.didUpdate()
// 				callChildrenMethod(this.context.children.values(), "didUpdate")
// 			})
// 			.build()
// 	}

// 	constructor(componentClass: new () => Component<any, any>, private props: createProperties, private children: CreatedElement[]) {
// 		super()
// 		this.instanceComponent = new componentClass()
// 		if (this.instanceComponent instanceof ReceiveComponent) {
// 			this.name = this.instanceComponent.receiveName
// 		}
// 		// TODO children
// 	}
// 	public mount(parent: AbstractActor): VNode {
// 		// init mount
// 		if (!this._mounted) {
// 			const selfActor = parent.context.actorOf(this, this.name)
// 			this.instanceComponent.setState = (nextState: object, callback = () => { }) => {
// 				// setstate 部分需要根据此函数判断是否刷新
// 				if (!this.instanceComponent.shouldUpdate(this.instanceComponent.props, nextState)) return
// 				Object.assign(this.instanceComponent.state, nextState)
// 				const vnode = this.instanceComponent.render().mount(this)
// 				this.renderer.tell(new Render(vnode), this.getSelf())
// 				callback()
// 			}
// 			this.instanceComponent.dispatch = parent.context.system.dispatch.bind(parent.context.system)
// 			this.instanceComponent.willMount()
// 		}

// 		if (this._mounted) {
// 			this.instanceComponent.receiveProps(this.instanceComponent.props, this.props)
// 		}
// 		this.instanceComponent.props = this.props

// 		const element = this.instanceComponent.render()
// 		if (element instanceof CompositeComponent && !element._mounted) {
// 			element.renderer = this.renderer
// 			this.context.actorOf(element)
// 		}
// 		this._mounted = true
// 		return element.mount(this)
// 	}
// }