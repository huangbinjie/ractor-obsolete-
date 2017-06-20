// import * as Ractor from "../../../../../src"
// export type TTodo = {
// 	status: string
// 	value: string
// }
// type Props = {
// 	display: string
// 	todos: TTodo[]
// }
// export class Control extends Ractor.Component<Props, void> {
// 	public render() {
// 		const { display, todos } = this.props
// 		return this.createElement("footer", { class: { footer: true } }, [
// 			this.createElement("span", { class: { "todo-count": true } }, [
// 				this.createElement("strong", {}, todos.filter(item => item.status === "active").length),
// 				" item left"
// 			]),
// 			this.createElement("ul", { class: { filters: true } }, [
// 				this.createElement("li", {}, this.createElement("a", { class: { [display === "all" ? "selected" : ""]: true }, href: "#/" }, "all")),
// 				this.createElement("li", {}, this.createElement("a", { class: { [display === "active" ? "selected" : ""]: true }, href: "#/active" }, "all")),
// 				this.createElement("li", {}, this.createElement("a", { class: { [display === "completed" ? "selected" : ""]: true }, href: "#/completed" }, "all"))
// 			]),
// 			this.createElement("button", { class: { "clear-completed": true }, on: { click: () => { } } }, "Clear completed")
// 		])
// 	}
// 	// private clearCompleted = () => {
// 	// 	const items = this.props.todos.filter(item => item.status !== "completed")
// 	// 	Store.children.Todo.setState({ todos: items }, () => localStorage.setItem("meng-todo", JSON.stringify(this.props)))
// 	// }
// 	// private show = display => () => Store.children.Todo.setState({ display }, () => localStorage.setItem("meng-todo", JSON.stringify(this.props)))
// } 
