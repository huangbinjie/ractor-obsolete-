import * as Ractor from "../../src"

class App extends Ractor.Component<null, { num: number }> {
	state = { num: 0 }
	render() {
		return (
			<div>
				<IncrementButton click={this.add} />
				{this.state.num}
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
