# Daleks Game

## Overview
A browser-based recreation of the classic Mac game "Daleks". Turn-based strategy game where the player must survive hostile robots by luring them into collisions.

## Recent Changes
- 2026-02-06: Initial implementation of full Daleks game

## Project Architecture
- **Frontend**: React + TypeScript with Zustand state management
- **Styling**: Custom CSS (not using Tailwind for game components)
- **Server**: Express serving the Vite-built frontend
- **No database needed**: Pure client-side game

### Key Files
- `client/src/lib/stores/useDaleks.tsx` - Game state and logic (Zustand store)
- `client/src/components/GameBoard.tsx` - Grid rendering and input handling
- `client/src/components/MainMenu.tsx` - Title screen and difficulty selection
- `client/src/components/Settings.tsx` - Key binding configuration
- `client/src/components/StatusBar.tsx` - Game status display
- `client/src/App.tsx` - Main app routing between screens

### Game Mechanics
- 2D grid, turn-based: player moves, then robots move
- 8-directional movement for player and robots
- Robots chase player using shortest path
- Robot collisions create piles; robots hitting piles die
- 3 teleports per level
- 3 difficulty levels affecting board size and robot count
- Configurable keyboard bindings stored in localStorage

## User Preferences
- None recorded yet
