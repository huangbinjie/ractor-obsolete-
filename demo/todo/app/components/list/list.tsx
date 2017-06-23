import * as Ractor from "../../../../../src"
import { TodoMessage } from "../../messages/todo"

export class List extends Ractor.Component<{ todos: TodoMessage["todos"] }, {}> {
	public render() {
		const items = this.props.todos.map((todo, index) => (
			<li className={todo.status} key={index}>
				<div className="view">
					<input className="toggle" type="checkbox" onchange={this.toggle(index)} checked={todo.status === "completed" ? true : false} />
					<label>{todo.value}</label>
					<button className="destroy" onclick={this.destroy(index)}></button>
				</div>
			</li>
		))
		return (
			<section className="main">
				<input className="toggle-all" type="checkbox" />
				<label htmlFor="toggle-all">Mark all as complete</label>
				<ul className="todo-list">
					{items}
				</ul>
			</section>
		)
	}

	private toggle = (index: number) => () => {
		const todos = [...this.props.todos]
		const item = todos[index]
		const toggledState = item.status === "active" ? "completed" : "active"
		item.status = toggledState
		this.dispatch("TODO", new TodoMessage({ todos }))
		localStorage.setItem("ractor-todo", JSON.stringify(this.props))
	}

	private destroy = index => () => {
		const todos = [...this.props.todos]
		todos.splice(index, 1)
		this.dispatch("TODO", new TodoMessage({ todos }))
		localStorage.setItem("ractor-todo", JSON.stringify(this.props))
	}
}
