# Developer Guide

## Repository structure

- `electron/` contains the main and preload processes.
- `src/renderer/` contains the React UI entry point and styles.
- `src/features/` contains isolated feature logic.
- `src/components/` contains reusable UI components.
- `src/store/` contains application state.
- `docs/` contains implementation and workflow documentation.

## Development rules

- Keep business logic out of page components.
- Add new UI through reusable components first.
- Prefer local services and typed contracts for any system interaction.
- Add tests alongside feature work when behavior changes.

## Recommended workflow

1. Check for existing reusable code.
2. Refactor common logic into services or shared helpers.
3. Implement the feature slice completely.
4. Validate with build and tests.
5. Update documentation when behavior changes.

## Commands

```bash
npm run dev
npm run build
npm run test
npm run lint
```
