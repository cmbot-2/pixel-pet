# Pixel Pet

Meet Mochi, a little pixel pet in a room drawn with Canvas.

Mochi starts with 65 hunger out of 100; 0 means full. Each Feed lowers hunger by 20, stopping at 0. Feeding a full pet leaves the meter at 0 and shows a message. Play and Sleep change the illustration and caption.

Hunger stays steady between snacks. Reloading resets the pet; progress is not saved yet.

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
