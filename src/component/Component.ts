import { Element } from "../element/Element"

export abstract class Component<P, S> {
	public state: S
	public props: P
	public abstract render(): Element
	public setState: (newState: Partial<S>, callback?: () => void) => void
	public dispatch: (receiveName: string, message: object) => void

	// lifecycle
	public willMount() { }
	public didMount() { }
	public didUpdate() { }
	public willUpdate(nextProps: P) { }
	public receiveProps(nextProps: P) { }
	public shouldUpdate(nextProps: P, nextState: S) { return true }
}