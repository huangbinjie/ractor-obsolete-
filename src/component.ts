import { CompositeComponent } from "./CompositeComponent"
import { DomComponent } from "./DomComponent"
import { CreatedElement } from "./createElement"

export abstract class Component<P, S> {
	public state: S
	public props: P
	public abstract render(): CreatedElement
	public setState: (newState: Partial<S>, callback?: () => void) => void
	public dispatch: (receiveName: string, message: object) => void

	// lifecycle
	public willMount() { }
	public didMount() { }
	public didUpdate() {}
}