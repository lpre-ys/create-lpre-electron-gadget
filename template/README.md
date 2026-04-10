# __PRODUCT_NAME__

Electron + Vite + Vue gadget template.

## Scripts

- `npm run dev`: Run Vite and Electron together for development.
- `npm run build`: Build renderer with TypeScript checks.
- `npm run electron`: Run Electron directly.

## Always-On-Top strategy

This template uses:

1. `setAlwaysOnTop(true, "pop-up-menu")`
2. Re-apply on `show`, `restore`, `focus`
3. Recover on `always-on-top-changed` when false
