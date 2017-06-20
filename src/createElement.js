"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_actor_1 = require("js-actor");
const CompositeComponent_1 = require("./CompositeComponent");
const HostComponent_1 = require("./HostComponent");
function createElement(nodeName, props = {}, ...children) {
    if (typeof nodeName === "string") {
        return new HostComponent_1.HostComponent(nodeName, props, children);
    }
    return new CompositeComponent_1.CompositeComponent(nodeName, props, children);
}
exports.createElement = createElement;
function createElementActor() {
    return class ElementActor extends js_actor_1.AbstractActor {
        createReceive() {
            return this.receiveBuilder().build();
        }
    };
}
