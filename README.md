# Pixel Pet

Meet Mochi, a little pixel pet in a room drawn with Canvas.

Mochi starts with 65 hunger, 50 happiness, and 80 energy, each out of 100.

- **Feed** lowers hunger by 20, stopping at 0 (full).
- **Play** gives Mochi a happy bounce, adds 15 happiness up to 100, and uses 10 energy. Playing requires at least 10 energy; a tired pet keeps its stats unchanged. Playing at full happiness still uses energy.
- **Sleep** closes Mochi's eyes and restores 5 energy per second, up to 100. The button becomes **Wake up**. Mochi stays asleep at full energy until you wake it.
- Feeding and playing while asleep do not apply their action effects and remind you to wake Mochi first.

Needs change with elapsed time: hunger rises by 2 per minute, happiness falls by 1 per minute, and awake energy falls by 1 per minute. Hunger and happiness also change during sleep. Values stay between 0 and 100; meters show rounded numbers, while fractional changes are retained. Care actions first settle elapsed time, and waking stops sleep recovery immediately.

Hidden tabs stop their update timer. Returning applies at most five minutes of elapsed time, so even a long absence adds at most 10 hunger and removes at most 5 happiness and 5 awake energy. Sleeping can restore energy to 100 during that time. A delayed foreground update has the same five-minute cap; extra time is discarded once. Backward clock changes freeze needs until the last recorded time is reached again. Mochi never dies or disappears, and feeding, rest, and play can always restore needs.

Mochi’s needs and sleep state save automatically in this browser after each care action and elapsed-time update. Reloading or reopening the same site restores them and applies at most five minutes away, once. A saved timestamp ahead of the current clock is reset to the reload time without changing needs.

A missing save starts a new visit. A corrupt or unsupported save starts fresh with a notice. If browser storage is unavailable or full, care continues in memory and a message explains that progress cannot be saved. Saves stay on this browser and site; clearing site data removes them. Multiple tabs share the save, with the most recent write winning.

The local save uses the `pixel-pet:care` key and a versioned format. No data is sent to a server.

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
