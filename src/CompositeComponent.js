"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_actor_1 = require("js-actor");
const renderer_1 = require("./renderer");
class CompositeComponent extends js_actor_1.AbstractActor {
    constructor(componentClass, props, children) {
        super();
        this.componentClass = componentClass;
        this.props = props;
        this.children = children;
    }
    createReceive() {
        return this.receiveBuilder().build();
    }
    mount() {
        this.instanceComponent = new this.componentClass();
        this.instanceComponent.props = this.props;
        this.instanceComponent.setState = (nextState) => {
            Object.assign(this.instanceComponent.state, nextState);
            const vnode = this.instanceComponent.render().mount();
            this.context.system.dispatch("renderer", new renderer_1.Render(vnode));
        };
        let element = this.instanceComponent.render();
        return element.mount();
    }
}
exports.CompositeComponent = CompositeComponent;
