import * as Ractor from "../../../../../src"
import { TodoMessage } from "../../messages/todo"

export class Header extends Ractor.Component<{ todos: TodoMessage["todos"] }, {}> {
	public render() {
		return (
			<header className="header">
				<h1>todos</h1>
				<input className="new-todo" onKeyDown={this.onkeydown} placeholder="What needs to be done?" autoFocus={true} />
			</header>
		)
	}

	private onkeydown = (event: KeyboardEvent) => {
		let value = (event.target as HTMLInputElement).value
		if (value === "") return
		if (event.keyCode === 13) {
			const newtodos = [...this.props.todos]
			newtodos.push({ status: "active", value })
			value = ""
			this.dispatch("TODO", new TodoMessage({ todos: newtodos }))
			localStorage.setItem("ractor-todo", JSON.stringify(this.props))
		}
	}
}
