# ContextOS

The AI operating layer that understands your screen.

ContextOS is a local-first desktop assistant built with Electron, React, TypeScript, Vite, Tailwind CSS, Zustand, and Framer Motion. The current implementation establishes the production-grade shell, a floating command palette, local shell state, and a typed Electron IPC bridge.

## What is included

- Electron + React + TypeScript desktop scaffold
- Floating command palette opened with `Ctrl + Space`
- Local shell navigation and persistent history state
- Typed preload bridge and main-process IPC handlers
- Feature-based folder structure
- Tailwind-driven dark UI foundation

## Architecture

See [docs/architecture.md](docs/architecture.md) for the high-level system design and [docs/api.md](docs/api.md) for the current bridge and command contracts.

## Getting started

1. Install dependencies.

```bash
npm install
```

2. Start the app in development mode.

```bash
npm run dev
```

3. Build a production bundle.

```bash
npm run build
```

4. Run the test suite.

```bash
npm run test
```

## Project status

The application currently ships the shell, palette, and navigation foundation. The next major implementation steps are screen capture, OCR, context building, and local AI inference.

## Deliverables

- [Installation guide](docs/installation.md)
- [Developer guide](docs/developer-guide.md)
- [Contribution guide](docs/contributing.md)
- [Release checklist](docs/release-checklist.md)
- [Roadmap](docs/roadmap.md)
- [Demo script](docs/demo-script.md)
- [Sample screenshots](docs/screenshots/README.md)

## License

MIT. See [LICENSE](LICENSE).
