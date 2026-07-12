# API Documentation

## Electron bridge

The renderer accesses Electron through `window.contextos`, defined in [src/shared/bridge.ts](src/shared/bridge.ts).

### Methods

- `getAppInfo(): Promise<AppInfo>`
- `readClipboard(): Promise<string>`
- `openExternal(url: string): Promise<boolean>`
- `onPaletteOpen(listener: () => void): () => void`
- `onPaletteVisibleChange(listener: (visible: boolean) => void): () => void`

## App info

`AppInfo` contains the application name, version, platform, and runtime versions from Electron, Chrome, and Node.

## Command registry

The first implemented command surface is the local intent registry in [src/features/palette/commandRegistry.ts](src/features/palette/commandRegistry.ts).

Each command returns:

- `title`
- `summary`
- `detail`
- `tags`

## Shell store

The global shell store in [src/store/shellStore.ts](src/store/shellStore.ts) currently tracks:

- active page
- palette visibility
- recent prompts
- generated actions
- recent context snapshots
- application info

## Contract rules

- Renderer code must not call Electron APIs directly.
- Privileged actions must remain behind the preload bridge.
- Shared types should live in `src/shared`.
