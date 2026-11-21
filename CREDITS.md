# Credits

This brand stands on other people's work. Where we use it, we say so. Where we
only learned from it, we say that too. Nothing below implies endorsement.

## Design lineage

- **letsimpl.fyi** (the org site) and **chaikadi.fyi** (the tea-break app), by
  Vysakh Premkumar. The wordmark, type scale, receipt, sheets and
  accessibility rules in this repo are inherited from those two design books. Their yellow, blue and green were dropped in v0.3: the brand is black and white.
  https://letsimpl.fyi · https://github.com/tellmeY18/chaikadi.fyi

## Research and standards we rely on

- **Paul Tol**, SRON Netherlands Institute for Space Research. *Paul Tol's Notes:
  colour schemes and templates.* We use his colours and his method.
  - Status fills, from the "light" scheme (made for fills that carry dark text):
    danger `#EE8866` (orange), warning `#EEDD88` (light yellow), success `#44BB99`
    (mint), info `#99DDFF` (light cyan).
  - Light-mode ink variants: danger `#CC3311` (vibrant red), success `#228833`
    (dark green), warning `#775500` (dark yellow), info `#4477BB` (dark blue).
    Dark-mode inks are the fills above.
  - Method: a perceptual colour-distance metric, simulation under red-blind and
    green-blind vision, and the greyscale-contrast findings.
  https://sronpersonalpages.nl/~pault/
- **Masataka Okabe and Kei Ito.** *Color Universal Design (CUD): how to make
  figures and presentations that are friendly to colorblind people.* Source of
  our rules on redundant coding, avoiding red against green at equal lightness,
  pale low-saturation pairs and red on black. https://jfly.uni-koeln.de/color/
- **W3C Web Accessibility Initiative.** *Web Content Accessibility Guidelines
  (WCAG) 2.2*, including SC 1.4.1 Use of Color and the relative-luminance
  contrast formula used in `src/contrast.js`. https://www.w3.org/WAI/WCAG22/
- **Gustavo M. Machado, Manuel M. Oliveira, Leandro A. F. Fernandes.** *A
  Physiologically-based Model for Simulation of Color Vision Deficiency.* IEEE
  Transactions on Visualization and Computer Graphics 15(6), 2009. The
  simulation matrices in `src/cvd.js` are theirs. We apply them in linear RGB
  and measure with CIELAB ΔE.
- **CIE.** CIELAB colour space, used for the distance measure.

## Fonts (SIL Open Font License 1.1)

Each font ships with its licence beside it in `fonts/`.

- **Atkinson Hyperlegible Mono** and **Atkinson Hyperlegible Next.** Copyright
  2020-2024 The Atkinson Hyperlegible Project Authors. Created by the Braille
  Institute of America for readers with low vision. We use the WOFF2 build
  packaged by Fontsource. https://brailleinstitute.org/freefont ·
  https://github.com/googlefonts/atkinson-hyperlegible-next ·
  https://fontsource.org
- **Courier Prime.** Copyright 2015 The Courier Prime Project Authors, Quote-Unquote
  Apps. https://github.com/quoteunquoteapps/CourierPrime
- **Noto Serif Malayalam.** Copyright 2022 The Noto Project Authors.
  https://github.com/notofonts/malayalam

## Software (MIT)

- **Preact**, by Jason Miller and contributors. https://preactjs.com
- **Vite**, by Evan You and contributors. https://vite.dev
- **@preact/preset-vite**, by the Preact team.

## Licence of this repo

AGPL-3.0-or-later, see `LICENSE`. Third-party material keeps its own licence.

## Adding a credit

If you use something, add it here in the same change, with the author, what we
took from it, the licence if it has one, and a link.
