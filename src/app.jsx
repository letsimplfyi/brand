import { useEffect, useState } from "preact/hooks";
import { Button, Icon, Input, Wordmark } from "../components/index.jsx";
import { useRoute } from "./router.js";
import { nav, flat } from "./nav.js";
import { Overview, Use, TokensPage } from "./pages/guides.jsx";
import { Colour, Typography, Spacing, Motion, Accessibility } from "./pages/foundations.jsx";
import { WordmarkPage, Assets } from "./pages/brand.jsx";
import { ComponentPage } from "./pages/components.jsx";

const pages = {
  overview: Overview, use: Use, tokens: TokensPage,
  colour: Colour, typography: Typography, spacing: Spacing, motion: Motion, accessibility: Accessibility,
  wordmark: WordmarkPage, assets: Assets,
};

const THEMES = ["auto", "light", "dark"];

function useTheme() {
  const [theme, set] = useState(() => localStorage.getItem("brand-theme") || "auto");
  useEffect(() => {
    const el = document.documentElement;
    if (theme === "auto") el.removeAttribute("data-theme"); else el.dataset.theme = theme;
    localStorage.setItem("brand-theme", theme);
  }, [theme]);
  return [theme, () => set(THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length])];
}

export function App() {
  const route = useRoute();
  const [theme, cycle] = useTheme();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  useEffect(() => setOpen(false), [route]);
  useEffect(() => { document.getElementById("main")?.focus({ preventScroll: true }); }, [route]);

  const current = flat.find((i) => i.id === route);
  useEffect(() => { document.title = `${current ? current.title + " · " : ""}brand · letsimpl.fyi`; }, [current]);

  const Page = route.startsWith("c/") ? () => <ComponentPage id={route.slice(2)} /> : pages[route];
  const needle = q.trim().toLowerCase();
  const groups = nav.map((g) => ({ ...g, items: g.items.filter((i) => !needle || i.title.toLowerCase().includes(needle)) })).filter((g) => g.items.length);

  return (
    <div class="shell">
      <a class="ls-skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main").focus(); }}>Skip to content</a>
      <header class="top">
        <Wordmark as="p" href="#/overview" animate={false} />
        <span class="grow" />
        <Button small class="menu-btn" aria-expanded={open} aria-controls="sidenav" onClick={() => setOpen(!open)}><Icon name="menu" small /><span class="lbl">Menu</span></Button>
        <Button small onClick={cycle} aria-label={`Theme: ${theme}. Change theme`}><Icon name={theme === "dark" ? "moon" : "sun"} small /><span class="lbl">{theme[0].toUpperCase() + theme.slice(1)}</span></Button>
      </header>
      <nav id="sidenav" class="sidenav" data-open={open} aria-label="Sections">
        <div class="search">
          <label class="ls-vh" for="q">Filter sections</label>
          <Input id="q" type="search" placeholder="Filter" value={q} onInput={(e) => setQ(e.currentTarget.value)} autocomplete="off" />
        </div>
        {groups.map((g) => (
          <section key={g.group}>
            <h2>{g.group}</h2>
            <ul>
              {g.items.map((i) => (
                <li key={i.id}><a href={`#/${i.id}`} aria-current={route === i.id ? "page" : undefined}>{i.title}</a></li>
              ))}
            </ul>
          </section>
        ))}
        {!groups.length && <p class="ls-hint">Nothing matches.</p>}
      </nav>
      <main id="main" class="content skip-target" tabIndex={-1}>
        {Page ? <Page /> : <NotFound />}
      </main>
      <footer class="foot">
        <p>AGPL-3.0-or-later. Fonts keep their own OFL notices. <a href="https://github.com/letsimplfyi/brand">Source</a></p>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <>
      <h1>Not found</h1>
      <p><a href="#/overview">Back to overview</a></p>
    </>
  );
}
