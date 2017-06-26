import * as Ractor from "../../src"

class App extends Ractor.Component<null, { num: number }> {
	state = { num: 0 }
	willMount() { console.log(1) }
	didMount() { console.log(2) }
	didUpdate() { console.log(this.state) }
	render() {
		return (
			<div>
				<IncrementButton click={this.add} />
				<span>{this.state.num}</span>
				<DecrementButton click={this.minus} />
			</div>
		)
	}
	add = () => {
		this.setState({ num: this.state.num + 1 })
	}
	minus = () => {
		this.setState({ num: this.state.num - 1 })
	}
}

type Props = {
	click: () => void
}
class IncrementButton extends Ractor.Component<Props, null> {
	render() {
		return <button onclick={this.props.click}>+</button>
	}
}
class DecrementButton extends Ractor.Component<Props, null> {
	render() {
		return <button onclick={this.props.click}>-</button>
	}
}

Ractor.render(document.getElementById("root")!, <App />)
