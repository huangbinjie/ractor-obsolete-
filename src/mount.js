"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HostComponent_1 = require("./HostComponent");
function mount(element) {
    if (element instanceof HostComponent_1.HostComponent) {
        element.mount();
    }
}
exports.mount = mount;
