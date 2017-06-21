import * as Ractor from "../../../../../src"
import { TodoMessage } from "../../messages/todo"

export class Control extends Ractor.Component<TodoMessage, {}> {
	public render() {
		const { display, todos } = this.props
		return (
			<footer className="footer">
				<span className="todo-count"><strong>{todos.filter(item => item.status === "active").length}</strong> item left</span>
				<ul className="filters">
					<li>
						<a className={display === "all" ? "selected" : ""} href="#/" onClick={this.show("all")}>All</a>
					</li>
					<li>
						<a className={display === "active" ? "selected" : ""} href="#/active" onClick={this.show("active")}>Active</a>
					</li>
					<li>
						<a className={display === "completed" ? "selected" : ""} href="#/completed" onClick={this.show("completed")}>Completed</a>
					</li>
				</ul>
				<button className="clear-completed" onClick={this.clearCompleted}>Clear completed</button>
			</footer>
		)
	}

	private clearCompleted = () => {
		const todos = this.props.todos.filter(item => item.status !== "completed")
		this.dispatch("TODO", new TodoMessage({ todos }))
		localStorage.setItem("ractor-todo", JSON.stringify(this.props))
	}
	private show = display => () => {
		this.dispatch("TODO", new TodoMessage({ display }))
		localStorage.setItem("ractor-todo", JSON.stringify(this.props))
	}
}