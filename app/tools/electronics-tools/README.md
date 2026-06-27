# Next.js Migration Files

This folder contains a portable Next.js version of the electronics tools UI.

## Files

- `ElectronicsTools.tsx`: self-contained client component with all calculator logic.
- `page.tsx`: example App Router page that renders the component.

## App Router Usage

Copy this folder into your Next.js project, for example:

```txt
app/electronics-tools/
  ElectronicsTools.tsx
  page.tsx
```

The component uses Tailwind CSS utility classes. Make sure Tailwind is already enabled in the destination Next.js site.

## Existing Page Usage

You can also copy only `ElectronicsTools.tsx` into any component folder and render it from an existing page:

```tsx
import ElectronicsTools from "@/components/ElectronicsTools";

export default function Page() {
  return <ElectronicsTools />;
}
```

No extra npm packages are required beyond React/Next.js and Tailwind CSS.
