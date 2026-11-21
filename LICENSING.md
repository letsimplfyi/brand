# Licensing

This repo has two licences, split by what the material is.

| What | Where | Licence |
| --- | --- | --- |
| **Code** | `src/`, `components/`, `css/`, `tools/`, `public/`, `flake.nix`, `Justfile`, `.github/`, `package.json`, `vite.config.js`, `index.html` | **AGPL-3.0-or-later**, see [LICENSE](LICENSE) |
| **Design and documentation** | `tokens/` (design values), `assets/` (brand assets and manifest), `DESIGN.md`, `README.md`, `AGENTS.md`, `CREDITS.md`, this file, the documentation text inside the showcase, `public/llms.txt` | **CC BY-SA 4.0**, see [LICENSE-CC-BY-SA-4.0](LICENSE-CC-BY-SA-4.0) |
| **Fonts** | `fonts/` | **SIL OFL 1.1**, each with its own notice beside it. Not ours to relicense. |
| **Third-party colours, ideas, libraries** | see [CREDITS.md](CREDITS.md) | Their own terms. Paul Tol's colour values are credited; they are not covered by our licences. |

Copyright © 2026 Vysakh Premkumar and the letsimpl.fyi contributors.

## What this means in practice

- **Using the code** (CSS, Preact components, build tools): AGPL-3.0-or-later. If you modify it and run it
  for others over a network, offer them the source of your version (AGPL section 13).
- **Using the design** (tokens, rules, documentation, assets): CC BY-SA 4.0. Credit us, say if you changed
  it, link the licence, and share what you make from it under the same licence.
- **Attribution:** "letsimpl.fyi brand, https://brand.letsimpl.fyi, CC BY-SA 4.0 / AGPL-3.0-or-later".
- **Fonts:** use them under the OFL as shipped. Keep the notices.
- **Wordmark and name:** the licences cover the files, not the name. Do not present your project as
  letsimpl.fyi or as endorsed by it.

## Contributing

By contributing you agree your code is AGPL-3.0-or-later and your design or documentation work is
CC BY-SA 4.0, matching the table above. Anything you add that is not yours goes in `CREDITS.md`
with its licence.

## Files

Where a file is in the code column but is data-like (for example `tokens/tokens.css`, which is generated
from `tokens/tokens.json`), it follows its source: design values are CC BY-SA 4.0. If unsure, ask.
