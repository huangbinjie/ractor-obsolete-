import { Todo } from "../types/todo"

export class TodoMessage {
	public todos?: Todo[]
	public display?: string
	constructor(state: TodoMessage) {
		Object.setPrototypeOf(state, new.target.prototype)
		return state
	}
}