// Preact components for letsimpl.fyi apps. Thin wrappers over css/components.css.
// Import the CSS once: tokens.css, base.css, components.css.
import { useEffect, useRef } from "preact/hooks";
import { icons } from "./icons.js";

const cx = (...a) => a.filter(Boolean).join(" ");

export function Icon({ name, small, ...rest }) {
  return (
    <svg class={cx("ls-icon", small && "ls-icon--sm")} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...rest}>
      <path d={icons[name]} />
    </svg>
  );
}

/** The wordmark: letsimpl.fyi with the i and the dot swapped. Real text, glyphs hidden from screen readers. */
export function Wordmark({ as: Tag = "span", href, animate = true, fit = false, class: cls }) {
  const glyphs = (
    <span aria-hidden="true">
      letsimpl<mark class="dot">.</mark>fy<mark class="eye">i</mark>
    </span>
  );
  return (
    <Tag class={cx("ls-mark", animate && "ls-mark--animate", fit && "ls-mark--fit", cls)}>
      {href ? <a href={href} aria-label="letsimpl.fyi">{glyphs}</a> : <span role="img" aria-label="letsimpl.fyi">{glyphs}</span>}
    </Tag>
  );
}

/** variant: default | primary (the one forward action) | outbound | danger (danger fill, dashed edge, triangle icon) */
export function Button({ variant = "default", small, icon, children, class: cls, ...rest }) {
  const Tag = rest.href ? "a" : "button";
  return (
    <Tag class={cx("ls-btn", variant !== "default" && `ls-btn--${variant}`, small && "ls-btn--small", cls)} {...(Tag === "button" ? { type: "button" } : {})} {...rest}>
      {variant === "danger" && <Icon name="alert" small />}
      {icon && <Icon name={icon} small />}
      {children}
    </Tag>
  );
}

export function OutLink({ children, ...rest }) {
  return <a class="ls-out" rel="noopener" {...rest}>{children}</a>;
}

export function Tags({ items = [] }) {
  return (
    <ul class="ls-tags">
      {items.map((t) => <li class="ls-tag" key={t}>{t}</li>)}
    </ul>
  );
}

export function Tag({ variant, children }) {
  return <span class={cx("ls-tag", variant && `ls-tag--${variant}`)}>{children}</span>;
}

export function Card({ title, children, as: Tag = "article" }) {
  return (
    <Tag class="ls-card">
      {title && <h3>{title}</h3>}
      {children}
    </Tag>
  );
}

/** A taped-on print. Pass `src` for a photo; without it a neutral slot is shown. Always decorative (alt=""). */
export function Print({ src, srcset, tilt = 0, ...rest }) {
  return (
    <figure class="ls-print" style={{ "--tilt": `${tilt}deg` }} aria-hidden="true">
      {src ? <img src={src} srcset={srcset} alt="" loading="lazy" decoding="async" {...rest} /> : <div class="ls-print__slot" />}
    </figure>
  );
}

export function Field({ id, label, hint, error, children }) {
  return (
    <div class="ls-field">
      <label for={id}>{label}</label>
      {hint && <span class="ls-hint" id={`${id}-hint`}>{hint}</span>}
      {children}
      {error && <span class="ls-callout ls-callout--error" id={`${id}-err`} role="alert"><Icon name="error" /><span><span class="ls-vh">Error: </span>{error}</span></span>}
    </div>
  );
}
export const Input = ({ class: c, ...p }) => <input class={cx("ls-input", c)} {...p} />;
export const Select = ({ class: c, children, ...p }) => <select class={cx("ls-select", c)} {...p}>{children}</select>;
export const Textarea = ({ class: c, ...p }) => <textarea class={cx("ls-textarea", c)} {...p} />;
export const Check = ({ children, ...p }) => <label class="ls-check"><input type="checkbox" {...p} />{children}</label>;

const calloutIcon = { error: "error", warning: "alert", info: "info", success: "success" };
const calloutWord = { error: "Error", warning: "Warning", info: "Note", success: "Success" };
/** kind: error | warning | info | success. Icon + hidden prefix + shape, never colour alone. */
export function Callout({ kind = "info", children }) {
  return (
    <div class={cx("ls-callout", `ls-callout--${kind}`)} role={kind === "error" ? "alert" : "note"}>
      <Icon name={calloutIcon[kind]} />
      <div><span class="ls-vh">{calloutWord[kind]}: </span>{children}</div>
    </div>
  );
}

/** state: fresh | stale | unverified */
export function Chip({ state = "fresh", children }) {
  const icon = { fresh: "check", stale: "clock", unverified: "alert" }[state];
  return <span class={cx("ls-chip", `ls-chip--${state}`)}><Icon name={icon} small />{children}</span>;
}

export function Receipt({ title, rows = [], total, totalLabel = "Total", stamp }) {
  return (
    <section class="ls-receipt" aria-label={title}>
      {title && <h3>{title}</h3>}
      {rows.map(([name, amount]) => (
        <div class="ls-receipt__row" key={name}><span class="name">{name}</span><span class="lead" aria-hidden="true" /><span>{amount}</span></div>
      ))}
      {total != null && <div class="ls-receipt__total"><span>{totalLabel}</span><span>{total}</span></div>}
      {stamp && <div class="ls-receipt__stamp">{stamp}</div>}
    </section>
  );
}

/** Native <dialog>: focus containment, Escape and backdrop-click close. */
export function Sheet({ open, onClose, title, children }) {
  const ref = useRef();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} class="ls-sheet" aria-label={title} onClose={onClose} onClick={(e) => e.target === ref.current && onClose?.()}>
      <div class="ls-sheet__handle" aria-hidden="true" />
      <div class="ls-sheet__head">
        <h2>{title}</h2>
        <Button small aria-label="Close" onClick={onClose}><Icon name="close" /></Button>
      </div>
      {children}
    </dialog>
  );
}

/** Render inside a polite live region so screen readers announce it. */
export function Toast({ children }) {
  return <span class="ls-toast">{children}</span>;
}

/** items: [{ id, label, icon, href }] */
export function BottomBar({ items = [], current, onSelect, label = "Primary" }) {
  return (
    <nav aria-label={label}>
      <ul class="ls-bottombar">
        {items.map((it) => (
          <li key={it.id}>
            <a href={it.href ?? `#${it.id}`} aria-current={current === it.id ? "page" : undefined} onClick={onSelect ? (e) => { e.preventDefault(); onSelect(it.id); } : undefined}>
              <Icon name={it.icon} />{it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Shown wherever a brand asset does not exist yet. Never draw a stand-in. */
export function Placeholder({ name, status = "missing", ratio }) {
  return (
    <div class="ls-slot" style={ratio ? { aspectRatio: ratio, minHeight: 0 } : undefined} role="img" aria-label={`${name}: ${status}`}>
      <b>{name}</b>
      <span>Placeholder · {status}</span>
    </div>
  );
}
