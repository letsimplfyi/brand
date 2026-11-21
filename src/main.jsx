import { render } from "preact";
import "../tokens/tokens.css";
import "../css/base.css";
import "../css/components.css";
import "./site.css";
import { App } from "./app.jsx";

render(<App />, document.getElementById("app"));
