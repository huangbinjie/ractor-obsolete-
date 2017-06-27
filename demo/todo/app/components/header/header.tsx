import * as Ractor from "../../../../../src"
import { TodoMessage } from "../../messages/todo"

export class Header extends Ractor.Component<{ todos: TodoMessage["todos"] }, {}> {
	public receiveProps(nextProps: { todos: TodoMessage["todos"] }) {
		// console.log(this.props, nextProps)
	}
	public render() {
		return (
			<header className="header">
				<h1>todos</h1>
				<input className="new-todo" onkeydown={this.onkeydown} placeholder="What needs to be done?" autoFocus={true} />
			</header>
		)
	}

	private onkeydown = (event: KeyboardEvent) => {
		const value = (event.target as HTMLInputElement).value
		if (value === "") return
		if (event.keyCode === 13) {
			(event.target as HTMLInputElement).value = ""
			const newtodos = [...this.props.todos]
			newtodos.push({ status: "active", value })
			this.dispatch("TODO", new TodoMessage({ todos: newtodos }))
			localStorage.setItem("ractor-todo", JSON.stringify(this.props))
		}
	}
}
