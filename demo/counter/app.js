"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ractor = require("../../src");
class App extends Ractor.Component {
    constructor() {
        super(...arguments);
        this.state = { num: 0 };
        this.add = () => {
            this.setState({ num: this.state.num + 1 });
        };
        this.minus = () => {
            this.setState({ num: this.state.num - 1 });
        };
    }
    render() {
        return (Ractor.createElement("div", null,
            Ractor.createElement(IncrementButton, { click: this.add }),
            this.state.num,
            Ractor.createElement(DecrementButton, { click: this.minus })));
    }
}
class IncrementButton extends Ractor.Component {
    render() {
        return Ractor.createElement("button", { onclick: this.props.click }, "+");
    }
}
class DecrementButton extends Ractor.Component {
    render() {
        return Ractor.createElement("button", { onclick: this.props.click }, "-");
    }
}
Ractor.render(document.getElementById("root"), Ractor.createElement(App, null));
