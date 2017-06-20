"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_actor_1 = require("js-actor");
const js_actor_2 = require("js-actor");
const virtual_dom_1 = require("virtual-dom");
exports.render = (container, root) => {
    const app = new js_actor_1.ActorSystem("reactor");
    const rendererActor = app.actorOf(new Renderer(container), "renderer");
    app.actorOf(root);
    const rootVnode = root.mount();
    rendererActor.tell(new Render(rootVnode));
};
class Renderer extends js_actor_2.AbstractActor {
    constructor(container) {
        super();
        this.container = container;
    }
    createReceive() {
        return this.receiveBuilder()
            .match(Render, render => {
            if (this.vtree) {
                const patches = virtual_dom_1.diff(this.vtree, render.newVnode);
                this.container = virtual_dom_1.patch(this.container, patches);
            }
            else {
                this.container = virtual_dom_1.create(render.newVnode);
            }
        })
            .build();
    }
}
exports.Renderer = Renderer;
class Render {
    constructor(newVnode) {
        this.newVnode = newVnode;
    }
}
exports.Render = Render;
