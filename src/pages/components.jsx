import { useState } from "preact/hooks";
import {
  BottomBar, Button, Callout, Card, Check, Chip, Field, Input, OutLink, Print, Receipt, Select, Sheet, Tag, Tags, Textarea, Toast,
} from "../../components/index.jsx";
import { Code, Demo, Do, Page, Table } from "../ui.jsx";

const Props = ({ rows }) => <Table head={["Prop", "Type", "Notes"]} rows={rows.map(([a, b, c]) => [<code>{a}</code>, <code>{b}</code>, c])} />;

function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Sheet title">
        <p>Native dialog. Escape, the close button and a tap on the scrim all close it.</p>
        <Button variant="primary" onClick={() => setOpen(false)}>Done</Button>
      </Sheet>
    </>
  );
}

function ToastDemo() {
  const [msg, setMsg] = useState("");
  const show = () => { setMsg("Copied"); setTimeout(() => setMsg(""), 3000); };
  return (
    <>
      <Button onClick={show}>Show toast</Button>
      <div aria-live="polite">{msg && <Toast>{msg}</Toast>}</div>
    </>
  );
}

function BarDemo() {
  const [cur, setCur] = useState("a");
  const items = [{ id: "a", label: "One", icon: "check" }, { id: "b", label: "Two", icon: "clock" }, { id: "c", label: "Three", icon: "info" }, { id: "d", label: "Four", icon: "menu" }];
  return <div style={{ width: "100%" }}><BottomBar items={items} current={cur} onSelect={setCur} /></div>;
}

const docs = {
  button: {
    title: "Button",
    lead: "Outlined by default. Crayon fills are rare and meaningful.",
    demo: () => (
      <>
        <Button>Default</Button>
        <Button variant="primary">Forward</Button>
        <Button variant="outbound">Outbound</Button>
        <Button variant="danger">Destructive</Button>
        <Button disabled>Disabled</Button>
        <Button small>Small</Button>
      </>
    ),
    code: `<Button>Default</Button>
<Button variant="primary">Forward</Button>
<Button variant="outbound" href="https://example.org">Outbound</Button>
<Button variant="danger">Destructive</Button>
<Button disabled>Disabled</Button>

<!-- plain HTML -->
<button class="ls-btn ls-btn--primary">Forward</button>`,
    props: [["variant", "default | primary | outbound | danger", "primary is green: the one forward action on a screen. outbound is blue and gets an arrow."], ["small", "boolean", "44px instead of 48px."], ["icon", "icon name", "Optional leading icon."], ["href", "string", "Renders an anchor."]],
    use: { yes: ["One primary per screen at most.", "Make the safe choice solid and the destructive one dashed with an alert icon."], no: ["Use green for decoration.", "Make a destructive action distinct by colour only."] },
  },
  link: {
    title: "Outbound link",
    lead: "Blue crayon plus a trailing arrow marks anything that leaves the site.",
    demo: () => (<><OutLink href="https://letsimpl.fyi">letsimpl.fyi</OutLink><a href="#/overview">Plain link, underlined</a></>),
    code: `<OutLink href="https://letsimpl.fyi">letsimpl.fyi</OutLink>

<a class="ls-out" href="https://letsimpl.fyi" rel="noopener">letsimpl.fyi</a>`,
    props: [["href", "string", "Required."]],
    use: { yes: ["Use plain underlined links inside the site."], no: ["Use the blue crayon for internal links."] },
  },
  tag: {
    title: "Tag",
    lead: "Outlined chips. Project tags are taken verbatim from GitHub topics.",
    demo: () => (<><Tags items={["offline-first", "preact", "pwa"]} /><Tag variant="green">Host</Tag><Tag>Orderer</Tag><Tag variant="sample">Sample</Tag></>),
    code: `<Tags items={["offline-first", "preact"]} />
<Tag variant="green">Host</Tag>
<Tag variant="sample">Sample</Tag>`,
    props: [["variant", "green | role | sample", "green is for roles and online state. sample is dashed."], ["items", "string[]", "On Tags."]],
  },
  card: {
    title: "Card",
    lead: "A bordered object: name, description, links, tags.",
    demo: () => (
      <Card title="Project name">
        <p>Description goes here.</p>
        <ul class="ls-links"><li><OutLink href="https://github.com/letsimplfyi">github.com/letsimplfyi</OutLink></li></ul>
        <Tags items={["tag"]} />
      </Card>
    ),
    wide: true,
    code: `<Card title="Project name">
  <p>Description goes here.</p>
  <ul class="ls-links"><li><OutLink href="…">…</OutLink></li></ul>
  <Tags items={["tag"]} />
</Card>`,
    props: [["title", "string", "Renders an h3."], ["as", "tag", "Defaults to article."]],
    use: { yes: ["Keep one card per object."], no: ["Nest cards."] },
  },
  print: {
    title: "Print",
    lead: "A taped-on photo: 2px frame, slight tilt, grey masking tape, always grayscale.",
    demo: () => (<><Print tilt={-2} /><Print tilt={1.5} /></>),
    code: `<Print src="/img/photo-960.webp" srcset="… 480w, … 960w" sizes="320px" tilt={-2} />`,
    props: [["src", "string", "Omit to render a neutral slot."], ["tilt", "number (deg)", "Between -2 and 2."]],
    use: { yes: ["Use public domain or CC0 photos and record provenance.", "Keep photos decorative: alt is always empty.", "Skip them when the browser asks to save data."], no: ["Put text on a photo.", "Use colour photos."] },
  },
  field: {
    title: "Fields",
    lead: "Visible labels, 16px type, 2px edges.",
    wide: true,
    demo: () => (
      <>
        <Field id="f1" label="Label" hint="Hint text"><Input id="f1" aria-describedby="f1-hint" /></Field>
        <Field id="f2" label="With an error" error="Say what went wrong and how to fix it."><Input id="f2" aria-invalid="true" aria-describedby="f2-err" value="Value" /></Field>
        <Field id="f3" label="Disabled"><Input id="f3" disabled value="Disabled" /></Field>
        <Field id="f4" label="Select"><Select id="f4"><option>One</option><option>Two</option></Select></Field>
        <Field id="f5" label="Notes"><Textarea id="f5" /></Field>
        <Check>Checkbox</Check>
      </>
    ),
    code: `<Field id="name" label="Label" hint="Hint text">
  <Input id="name" aria-describedby="name-hint" />
</Field>
<Field id="p" label="Price" error="…">
  <Input id="p" inputMode="decimal" aria-invalid="true" aria-describedby="p-err" />
</Field>`,
    props: [["label", "string", "Always visible. Never use placeholder as a label."], ["hint", "string", "Wire with aria-describedby."], ["error", "string", "Announced with role=alert."]],
  },
  callout: {
    title: "Callout",
    lead: "State is carried by icon, shape and a hidden word, never colour.",
    wide: true,
    demo: () => (
      <>
        <Callout kind="error">Error: 8px left bar.</Callout>
        <Callout kind="warning">Warning: double border.</Callout>
        <Callout kind="info">Note: hairline border.</Callout>
      </>
    ),
    code: `<Callout kind="error">…</Callout>
<Callout kind="warning">…</Callout>
<Callout kind="info">…</Callout>`,
    props: [["kind", "error | warning | info", "error uses role=alert."]],
  },
  chip: {
    title: "Chip",
    lead: "Status with a 16px icon and words.",
    demo: () => (<><Chip state="fresh">Fresh</Chip><Chip state="stale">Stale</Chip><Chip state="unverified">Unverified</Chip></>),
    code: `<Chip state="fresh">…</Chip>
<Chip state="stale">…</Chip>
<Chip state="unverified">…</Chip>`,
    props: [["state", "fresh | stale | unverified", "check + bold, clock + double border, alert + dashed."]],
  },
  receipt: {
    title: "Receipt",
    lead: "Paper stock, perforated edges, Courier Prime. It never inverts in dark mode.",
    wide: true,
    demo: () => <Receipt title="Receipt" rows={[["Item one", "10.00"], ["A much longer item name that wraps", "20.00"]]} total="30.00" stamp="STAMP" />,
    code: `<Receipt title="…" rows={[["Item", "10.00"]]} total="10.00" stamp="…" />`,
    props: [["rows", "[name, amount][]", "Dotted leaders are decorative."], ["total", "string", "32px under a double rule."], ["stamp", "string", "Tilted ink stamp, never coloured."]],
  },
  sheet: {
    title: "Sheet",
    lead: "Square, 2px top rule, no shadow. Native dialog provides focus containment.",
    demo: () => <SheetDemo />,
    code: `<Sheet open={open} onClose={() => setOpen(false)} title="…">…</Sheet>`,
    props: [["open", "boolean", "Drives showModal()/close()."], ["onClose", "() => void", "Fires on Escape, close button and scrim tap."], ["title", "string", "Also the accessible name."]],
  },
  toast: {
    title: "Toast",
    lead: "Ink on paper, polite live region, gone after 3 seconds.",
    demo: () => <ToastDemo />,
    code: `<div aria-live="polite">{msg && <Toast>{msg}</Toast>}</div>`,
    props: [["children", "node", "Render inside a live region that already exists in the DOM."]],
  },
  bottombar: {
    title: "Bottom bar",
    lead: "App navigation. Four icons, 12px labels, at least 64px tall.",
    wide: true,
    demo: () => <BarDemo />,
    code: `<BottomBar items={[{ id: "a", label: "One", icon: "check" }]} current="a" onSelect={setTab} />`,
    props: [["items", "{id,label,icon,href?}[]", "Up to four."], ["current", "string", "Selected tab gets a 3px ink top bar and aria-current."]],
    use: { yes: ["Use in apps only."], no: ["Use on content sites; they use a plain list of links."] },
  },
};

export function ComponentPage({ id }) {
  const d = docs[id];
  if (!d) return <Page title="Not found" />;
  return (
    <Page title={d.title} lead={d.lead}>
      <Demo wide={d.wide} code={d.code}>{d.demo()}</Demo>
      {d.props && <><h2>Props</h2><Props rows={d.props} /></>}
      {d.use && <Do {...d.use} />}
    </Page>
  );
}
