import * as Ractor from "../../../src"
import { Todo } from "./containers/todo"

Ractor.render(document.getElementById("root"), <Todo />)