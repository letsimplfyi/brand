export const nav = [
  { group: "Start", items: [
    { id: "overview", title: "Overview" },
    { id: "use", title: "Use in an app" },
  ] },
  { group: "Foundations", items: [
    { id: "colour", title: "Colour" },
    { id: "vision", title: "Colour vision" },
    { id: "typography", title: "Typography" },
    { id: "spacing", title: "Spacing and layout" },
    { id: "motion", title: "Motion" },
    { id: "accessibility", title: "Accessibility" },
  ] },
  { group: "Brand", items: [
    { id: "wordmark", title: "Wordmark" },
    { id: "assets", title: "Assets" },
  ] },
  { group: "Components", items: [
    { id: "c/button", title: "Button" },
    { id: "c/link", title: "Outbound link" },
    { id: "c/tag", title: "Tag" },
    { id: "c/card", title: "Card" },
    { id: "c/print", title: "Print" },
    { id: "c/field", title: "Fields" },
    { id: "c/callout", title: "Callout" },
    { id: "c/chip", title: "Chip" },
    { id: "c/receipt", title: "Receipt" },
    { id: "c/sheet", title: "Sheet" },
    { id: "c/toast", title: "Toast" },
    { id: "c/bottombar", title: "Bottom bar" },
  ] },
  { group: "Reference", items: [
    { id: "tokens", title: "All tokens" },
    { id: "credits", title: "Credits" },
  ] },
];
export const flat = nav.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group })));
