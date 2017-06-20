# Ractor

验证 actor 做出 react 组件化的架构，暂时还是玩具。

## 想法

`everything is actor`.

框架由两个核心部分: `RendererActor` 和 `CompositeComponentActor`

+ RendererActor 是一个专门把 vnode 同步到真实 dom 的 actor。只需要等新的 vnode 进来，就立即工作。
+ CompositeComponentActor 就是 keep 了用户定义的组件实例的 actor。主要工作就是调用组件的`render`方法生成 vnode，然后作为消息传给 RendererActor。

待续...