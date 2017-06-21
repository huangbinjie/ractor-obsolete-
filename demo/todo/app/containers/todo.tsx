import * as Ractor from "../../../../src"
import { Control } from "../components/control/control"
import { Header } from "../components/header/header"
import { List } from "../components/list/list"
import { TodoMessage } from "../messages/todo"

export class Todo extends Ractor.ReceiveComponent<{}, TodoMessage> {
	public receiveName = "TODO"
	public createReceive() {
		return this.receiveBuilder().match(TodoMessage, todo => this.setState(todo))
	}
	public willMount() { }
	public didMount() { }
	public render() {
		return (
			<section className="todoapp">
				<Header todos={this.state.todos} />
				<List todos={this.state.todos} />
				<Control display={this.state.display} todos={this.state.todos} />
			</section>
		)
	}
}


