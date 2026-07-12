# 🏛 ContextOS Architecture

> Version: 1.0.0
>
> This document defines the architecture of ContextOS.
>
> Every new feature must follow this architecture.
>
> Do not introduce alternative architectures without strong justification.

---

# System Overview

ContextOS is an AI Operating Layer that understands what the user is currently doing and assists them using **100% on-device AI**.

The application follows a layered architecture.

```
+------------------------------------------------------+
|                    React UI                          |
| Pages • Components • Command Palette                |
+------------------------------------------------------+
                        │
                        ▼
+------------------------------------------------------+
|                  React Hooks                         |
+------------------------------------------------------+
                        │
                        ▼
+------------------------------------------------------+
|                  Business Services                   |
| Context • OCR • AI • Memory • Models                |
+------------------------------------------------------+
                        │
                        ▼
+------------------------------------------------------+
|                  Electron IPC                        |
+------------------------------------------------------+
                        │
                        ▼
+------------------------------------------------------+
|                Electron Main Process                 |
| Screen Capture • Shortcuts • File System            |
+------------------------------------------------------+
                        │
                        ▼
+------------------------------------------------------+
|                 Operating System                     |
+------------------------------------------------------+
```

---

# Design Principles

ContextOS follows these principles:

- Layered Architecture
- Feature-Based Structure
- Single Responsibility Principle
- Dependency Inversion
- Composition over Inheritance
- Loose Coupling
- High Cohesion
- Local First
- Privacy First

---

# High-Level Architecture

```
User

↓

Ctrl + Space

↓

Command Palette

↓

Screen Capture

↓

OCR Engine

↓

Context Engine

↓

Prompt Builder

↓

Local AI Model

↓

Response Formatter

↓

UI Response
```

---

# Major Modules

## UI Layer

Responsible only for rendering.

Contains

- Pages
- Components
- Dialogs
- Command Palette
- Settings
- Dashboard

The UI must never:

- Call Electron directly
- Build prompts
- Execute AI models
- Access databases

---

## Hooks Layer

Contains reusable React hooks.

Examples

useOCR()

useAI()

useMemory()

useContext()

useSettings()

Hooks coordinate state.

Hooks do not contain business logic.

---

## Services Layer

The heart of the application.

Contains

ContextService

OCRService

AIService

MemoryService

ModelService

SettingsService

HistoryService

PromptBuilder

Business logic belongs here.

---

## Electron Layer

Responsible for

- Screen Capture
- Global Shortcuts
- Native Dialogs
- File System
- Permissions

React communicates through IPC only.

---

## Storage Layer

SQLite

Stores

- Settings
- History
- Metadata
- Commands

LanceDB

Stores

- Embeddings
- Semantic Search

Never mix these responsibilities.

---

# Folder Architecture

```
src/

components/
    ui/
    layout/
    common/

features/
    commandPalette/
    history/
    memory/
    settings/
    dashboard/

hooks/

services/

models/

store/

types/

utils/

pages/

assets/

electron/
```

Each folder has one responsibility.

---

# Feature Architecture

Every feature should follow

```
feature/

components/

hooks/

services/

types/

utils/
```

Example

```
features/

commandPalette/

components/

hooks/

services/

types/
```

Features should remain isolated.

---

# Service Responsibilities

## ContextService

Collect

- Active application
- Window title
- Clipboard
- OCR
- Selected text
- Browser URL
- Timestamp

Returns

Context Object

---

## OCRService

Receives

Image

Returns

Structured OCR

Responsibilities

- OCR
- Layout Detection
- Table Detection
- Image Preprocessing

---

## PromptBuilder

Receives

Context

User Intent

History

Returns

Optimized Prompt

No UI should build prompts.

---

## AIService

Responsibilities

- Load model
- Execute inference
- Format response
- Handle errors

Supports

- Phi-3
- Gemma
- Qwen

---

## MemoryService

Stores

History

Prompts

Responses

Embeddings

Provides

Semantic Search

Timeline

Delete

Export

---

## ModelService

Responsible for

- Download
- Install
- Delete
- Enable
- Disable
- Versioning

---

# AI Pipeline

```
Screen Capture

↓

OCR

↓

Context Engine

↓

Prompt Builder

↓

Local LLM

↓

Response Formatter

↓

Command Palette
```

Every AI request follows this pipeline.

---

# Context Object

Every request should generate

```ts
interface Context {

application: string;

windowTitle: string;

clipboard?: string;

ocrText: string;

selectedText?: string;

browserUrl?: string;

timestamp: Date;

screenResolution: string;

activeMonitor: number;

}
```

Never send raw screenshots directly into prompts.

Always use structured context.

---

# IPC Architecture

```
React

↓

contextBridge

↓

IPC

↓

Electron Main

↓

Native APIs
```

No renderer component should access Node.js directly.

---

# State Architecture

Global State

- Theme
- Settings
- Current Model
- AI Status

Feature State

- Palette
- OCR
- Context
- Suggestions

Component State

- Form values
- Dialog visibility

Never put temporary state in Zustand.

---

# AI Model Architecture

Every model must implement

```ts
interface AIModel {

load()

infer()

dispose()

metadata()

}
```

This allows swapping models without changing application logic.

---

# OCR Pipeline

```
Image

↓

Preprocessing

↓

OCR

↓

Layout Analysis

↓

Table Detection

↓

Structured JSON
```

OCR should be isolated inside OCRService.

---

# Memory Architecture

```
Context

↓

Embedding

↓

LanceDB

↓

Semantic Search
```

Structured data

↓

SQLite

---

# Command Flow

```
User presses

Ctrl + Space

↓

Palette Opens

↓

Screen Capture

↓

OCR

↓

Context

↓

Prompt

↓

Local AI

↓

Response

↓

Display
```

---

# Error Handling

Every service returns

```ts
type Result<T> = {

success: boolean;

data?: T;

error?: string;

}
```

Never throw uncaught exceptions to the UI.

---

# Performance Goals

Cold Start

< 3s

Command Palette

< 100ms

OCR

< 2s

Inference

< 5s

UI

60 FPS

Lazy load models.

Run heavy AI work off the main UI thread.

---

# Security

Never enable

nodeIntegration

Always use

contextIsolation

preload

secure IPC

Validate IPC payloads.

Never expose unrestricted native APIs.

---

# Future Plugin System

Future architecture should support

```
plugins/

plugin.json

index.ts

commands.ts

settings.ts
```

Every plugin should register

Commands

Menus

Settings

Permissions

without modifying the core application.

---

# Data Flow

```
Operating System

↓

Electron Main

↓

IPC

↓

Services

↓

AI

↓

React UI
```

Data flows in one direction.

Avoid circular dependencies.

---

# Definition of Done

A feature is architecturally complete when:

- Fits into existing layers
- Does not violate separation of concerns
- Uses services instead of UI logic
- Uses IPC correctly
- Is modular
- Is reusable
- Is testable
- Does not duplicate existing functionality

---

# Instructions for GitHub Copilot

Before implementing any feature:

1. Read this architecture.
2. Follow the existing layers.
3. Never bypass services.
4. Never access Electron APIs from React.
5. Keep business logic inside services.
6. Reuse existing modules.
7. Prefer extension over duplication.
8. Keep architecture consistent across the project.