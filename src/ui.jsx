import { useState } from "preact/hooks";
import { Icon, Button } from "../components/index.jsx";

export function Page({ title, lead, children }) {
  return (
    <>
      <h1>{title}</h1>
      {lead && <p class="lead">{lead}</p>}
      {children}
    </>
  );
}

export function Code({ code, label = "Code" }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 2000); } catch {}
  };
  return (
    <div class="code">
      <div class="code__bar">
        <span>{label}</span>
        <button type="button" class="code__copy" onClick={copy}><Icon name={done ? "check" : "copy"} small />{done ? "Copied" : "Copy"}</button>
      </div>
      <pre tabIndex={0}><code>{code}</code></pre>
      <span class="ls-vh" role="status">{done ? "Copied to clipboard" : ""}</span>
    </div>
  );
}

/** A live preview above its source. */
export function Demo({ children, code, wide }) {
  return (
    <div class="demo">
      <div class={`demo__stage${wide ? " demo__stage--wide" : ""}`}>{children}</div>
      {code && <Code code={code} />}
    </div>
  );
}

export function Table({ head, rows }) {
  return (
    <div class="table-wrap" tabIndex={0} role="region" aria-label="Table, scrollable">
      <table>
        <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => (j === 0 ? <th scope="row" key={j}>{c}</th> : <td key={j}>{c}</td>))}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function Do({ yes = [], no = [] }) {
  return (
    <div class="dodont">
      <section><h3><Icon name="check" small /> Do</h3><ul>{yes.map((t) => <li key={t}>{t}</li>)}</ul></section>
      <section><h3><Icon name="close" small /> Don't</h3><ul>{no.map((t) => <li key={t}>{t}</li>)}</ul></section>
    </div>
  );
}

export { Button };
