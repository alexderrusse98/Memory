# Memory

A themeable memory card game for two players, built with Vite, TypeScript and SCSS.

## Live Demo

[Play the game](https://alexander-wiederhold.developerakademie.net/Memory/index.html)

## Preview

<img width="1440" height="1008" alt="memory" src="https://github.com/user-attachments/assets/920f785f-5912-41f0-9329-74e1f7b6ec85" />


## Features

- Two-player mode with automatic turn switching (a matched pair keeps the turn)
- Four selectable themes — Code Vibes, Games, DA Projects and Food — each with its own icon set, fonts and colour scheme
- Live scoreboard with separate result screens for win and draw
- Exit confirmation via native `<dialog>` element, closable by clicking the backdrop
- Responsive layout
- Double-click protection to prevent flipping the same card twice

## Tech Stack

- **TypeScript** — fully typed game logic
- **Vite** — build tool and dev server
- **SCSS** — theming via `data-theme` attributes, BEM-inspired class naming
- No frameworks, no external dependencies

## What I Worked On

**Event delegation instead of per-card listeners.** Rather than attaching a click handler to every card, a single listener sits on the board and resolves the clicked card from the event target. Fewer listeners, and dynamically rendered cards work without re-binding.

**Theming through CSS, not JavaScript.** Colours, fonts and icons are switched by setting a `data-theme` attribute on a container element; SCSS handles the rest. The TypeScript side stays free of styling concerns, and adding a fifth theme means adding a stylesheet block and an icon folder — not touching the logic.

**Centralised state.** Game state and settings live in a dedicated `state.ts` module instead of being spread across the DOM, which made turn switching and score handling much easier to reason about.

## Running Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
  ts/          # game logic, state, rendering
  styles/      # SCSS, one partial per theme
  assets/      # icons and fonts, organised per theme
  main.ts      # entry point
```
