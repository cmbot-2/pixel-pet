# Pixel Pet

Meet Mochi, a little pixel pet in a room drawn with Canvas.

Use Feed, Play, and Sleep to change Mochi's activity illustration and caption. The buttons are visual previews; the current build does not track needs or save progress.

## Run locally

Use Node.js 20.19.x or Node.js 22.12+ and npm. From the repository folder:

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal.

## Development

```sh
npm run check   # Check TypeScript
npm run build   # Check types and build into dist/
npm run preview # Serve the build locally
```

Built with TypeScript and Vite.
