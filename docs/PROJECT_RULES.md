# 📜 ContextOS Project Rules

> Version: 1.0.0
>
> This document defines the engineering standards for ContextOS.
>
> Every contributor (human or AI) must follow these rules.

---

# Project Mission

ContextOS is an AI Operating Layer.

It is **NOT** another chatbot.

It understands what the user is currently doing and helps them complete work using **100% on-device AI**.

Every implementation decision should support this mission.

---

# Core Engineering Principles

## 1. Privacy First

Everything should execute locally whenever possible.

Never upload:

- Screenshots
- Clipboard
- OCR text
- Documents
- Images
- User files
- Conversation history

Cloud services may only be used for:

- Authentication
- Update checks
- Optional synchronization

Core AI inference must remain local.

---

## 2. Modular Architecture

Every feature must be independent.

Features should be removable without affecting unrelated parts of the application.

Avoid tightly coupled code.

---

## 3. Reusability

Before writing new code ask:

- Does this already exist?
- Can an existing component be extended?
- Can this become reusable?

Never duplicate business logic.

---

## 4. Simplicity

Prefer simple architecture.

Avoid unnecessary abstractions.

Avoid premature optimization.

Write code that another engineer can understand six months later.

---

# Development Workflow

Every feature follows this lifecycle.

Research

↓

Design

↓

Implementation

↓

Testing

↓

Documentation

↓

Integration

↓

Review

Never skip a stage.

---

# TypeScript Rules

Always use:

- strict mode
- explicit types
- interfaces
- enums where appropriate
- readonly when applicable

Never use:

- any
- @ts-ignore
- implicit any
- unnecessary type assertions

Every exported function must have typed inputs and outputs.

---

# React Rules

Only Functional Components.

Use hooks.

Prefer composition.

Avoid class components.

Keep components focused.

Component responsibilities:

- UI only
- No business logic
- No direct Electron API usage

Business logic belongs inside services.

---

# Component Rules

Components should:

- Receive data via props
- Be reusable
- Be accessible
- Be testable

Avoid components larger than 300 lines.

If a component grows too large:

Split it.

---

# Folder Responsibilities

src/

components/

Reusable UI components

features/

Feature-specific UI

pages/

Application pages

services/

Business logic

hooks/

Reusable React hooks

store/

Global state

utils/

Helper functions

types/

Shared types

models/

AI model wrappers

electron/

Native desktop logic

tests/

Testing

Never mix responsibilities.

---

# Electron Rules

Renderer Process

Must never access Node.js APIs directly.

Use preload scripts.

Use secure IPC.

Main Process

Responsible for:

- Screen capture
- File system
- Global shortcuts
- Native dialogs
- Native permissions

Never expose unrestricted APIs.

---

# IPC Rules

All communication between Renderer and Main must use IPC.

Create dedicated IPC channels.

Validate all IPC messages.

Never expose Node globals.

---

# AI Rules

Every AI model must implement the same interface.

Example:

load()

infer()

dispose()

metadata()

This allows models to be swapped without changing application logic.

Never hardcode model-specific code inside the UI.

---

# OCR Rules

OCR must exist only inside OCRService.

UI should never directly call PaddleOCR or Tesseract.

OCRService responsibilities:

- Image preprocessing
- OCR execution
- Layout detection
- Table extraction
- Error handling

---

# Context Engine Rules

Every AI request must pass through ContextEngine.

Context object should contain only structured information.

Example:

Application Name

Window Title

Clipboard

OCR Text

Browser URL

Timestamp

Selected Text

Never send raw screenshots directly into the prompt.

---

# Prompt Builder Rules

PromptBuilder is responsible for:

- Prompt formatting
- Context injection
- Token optimization
- Response formatting

UI should never build prompts.

---

# Memory Rules

Memory is optional.

Users must be able to:

- Disable memory
- Delete memory
- Export memory
- Clear all history

No hidden storage.

Everything stored locally.

---

# Database Rules

SQLite stores:

- History
- Settings
- Metadata

LanceDB stores:

- Embeddings
- Semantic search indexes

Never mix structured data with vector data.

---

# Performance Rules

Application startup:

Target < 3 seconds

Command Palette:

Target < 100 ms

Screen Capture:

Target < 500 ms

OCR:

Target < 2 seconds

Inference:

Target < 5 seconds

Never block the UI thread.

Use workers where appropriate.

---

# State Management Rules

Use Zustand.

Global state only for:

- Theme
- Settings
- Current Model
- AI Status
- Memory Status

Do not store temporary UI state globally.

---

# Styling Rules

Use:

- TailwindCSS
- shadcn/ui
- Framer Motion
- Lucide Icons

Design language:

- Minimal
- Modern
- Dark-first
- Glassmorphism
- Consistent spacing
- Subtle animations

Avoid excessive animations.

---

# Naming Conventions

Components

PascalCase

Example:

CommandPalette.tsx

Hooks

useSomething.ts

Services

contextService.ts

Stores

useModelStore.ts

Utilities

camelCase

Types

PascalCase

Files should describe their responsibility clearly.

---

# Error Handling

Every async operation must:

- Handle exceptions
- Log useful errors
- Return meaningful messages
- Fail gracefully

Never crash silently.

---

# Logging

Use structured logging.

Development:

Verbose logs

Production:

Errors only

Never log:

- Clipboard contents
- OCR text
- User screenshots
- Personal information

---

# Accessibility

Support:

- Keyboard navigation
- Screen readers where possible
- High contrast
- Focus indicators

All interactive elements should be keyboard accessible.

---

# Security

Never use:

nodeIntegration: true

Always use:

contextIsolation

preload scripts

secure IPC

Validate all external input.

---

# Testing

Every critical service should have tests.

Required:

- Unit Tests
- Integration Tests
- Component Tests (where useful)

Critical paths:

- Screen Capture
- OCR
- AI Inference
- Context Engine
- IPC

---

# Documentation

Every major feature must include:

Purpose

Architecture

Dependencies

Usage

Limitations

Update documentation whenever behavior changes.

---

# Git Commit Convention

Use Conventional Commits.

Examples:

feat: implement command palette

feat: add screen capture service

fix: resolve OCR parsing issue

refactor: simplify context engine

docs: update roadmap

test: add AI inference tests

style: improve dashboard layout

---

# Pull Request Checklist

Before merging:

- Builds successfully
- No TypeScript errors
- No lint errors
- Tests pass
- Documentation updated
- No duplicate code
- Performance verified

---

# Definition of Done

A feature is complete only if:

✅ Builds successfully

✅ Runs without errors

✅ Uses reusable architecture

✅ Fully typed

✅ Tested

✅ Documented

✅ Integrated into the UI

✅ Meets performance goals

✅ Follows privacy requirements

---

# Copilot Development Instructions

Whenever implementing code:

1. Read ROADMAP.md.
2. Read ARCHITECTURE.md.
3. Read this document.
4. Implement only the active milestone.
5. Never skip milestones.
6. Reuse existing code whenever possible.
7. Keep the application runnable after every change.
8. Explain architectural decisions.
9. Avoid placeholder implementations.
10. Write production-quality code suitable for an open-source project.

If there is uncertainty, choose the solution that is:

- More modular
- More maintainable
- Easier to test
- Easier to extend
- More privacy-preserving

Quality is always preferred over speed.