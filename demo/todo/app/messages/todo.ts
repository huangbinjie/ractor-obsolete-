import { Todo } from "../types/todo"

export class TodoMessage {
	public todos: Todo[]
	public display: "all" | "active" | "completed"
	constructor(state: Partial<TodoMessage>) {
		Object.setPrototypeOf(state, new.target.prototype)
	}
}