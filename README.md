# Pixel Pet

Meet Mochi, a little pixel pet in a room drawn with Canvas.

Mochi starts with 65 hunger, 50 happiness, and 80 energy, each out of 100.

- **Feed** lowers hunger by 20, stopping at 0 (full).
- **Play** gives Mochi a happy bounce, adds 15 happiness up to 100, and uses 10 energy. Playing requires at least 10 energy; a tired pet keeps its stats unchanged. Playing at full happiness still uses energy.
- **Sleep** closes Mochi's eyes and restores 5 energy per full second, up to 100. The button becomes **Wake up**. Mochi stays asleep at full energy until you wake it.
- Feeding and playing while asleep leave the stats unchanged and remind you to wake Mochi first.

Hunger and happiness stay steady between actions. Energy recovers only while sleeping; delayed updates catch up to the 100-point cap while the page is open. Waking stops recovery immediately. Reloading starts a fresh, awake visit with the initial stats; progress is not saved yet.

## Run locally

Use Node.js 20.19.x or Node.js 22.12+ and npm. From the repository folder:

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal.

## Development

```sh
npm test        # Run regression checks
npm run check   # Check TypeScript
npm run build   # Check types and build into dist/
npm run preview # Serve the build locally
```

Built with TypeScript and Vite.
