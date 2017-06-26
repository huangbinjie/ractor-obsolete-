import { VNode } from "./vnode"

type Child = string | VNode | ArrayChild
interface ArrayChild extends Array<Child> { }

export function h(nodeName: string, props: {}, children: Child[]) {

}