"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const virtual_dom_1 = require("virtual-dom");
class HostComponent {
    constructor(nodeName, props, children) {
        this.nodeName = nodeName;
        this.props = props;
        this.children = children;
    }
    mount() {
        const children = this.children.map(child => child.mount());
        return virtual_dom_1.h(this.nodeName, this.props, children);
    }
}
exports.HostComponent = HostComponent;
