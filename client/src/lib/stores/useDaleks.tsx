import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getLocalStorage, setLocalStorage } from "../utils";

export type Difficulty = "easy" | "medium" | "hard";

export type GamePhase = "menu" | "playing" | "levelCleared" | "gameOver" | "settings";

export interface Position {
  x: number;
  y: number;
}

export interface Robot {
  id: number;
  pos: Position;
  alive: boolean;
}

export interface Pile {
  pos: Position;
}

export interface KeyBindings {
  north: string;
  northwest: string;
  west: string;
  southwest: string;
  south: string;
  southeast: string;
  east: string;
  northeast: string;
  stay: string;
  teleport: string;
}

const DEFAULT_KEY_BINDINGS: KeyBindings = {
  north: "w",
  northwest: "q",
  west: "a",
  southwest: "z",
  south: "x",
  southeast: "c",
  east: "d",
  northeast: "e",
  stay: "s",
  teleport: "t",
};

const DIRECTION_DELTAS: Record<string, Position> = {
  north: { x: 0, y: -1 },
  northwest: { x: -1, y: -1 },
  west: { x: -1, y: 0 },
  southwest: { x: -1, y: 1 },
  south: { x: 0, y: 1 },
  southeast: { x: 1, y: 1 },
  east: { x: 1, y: 0 },
  northeast: { x: 1, y: -1 },
};

interface DifficultyConfig {
  cols: number;
  rows: number;
  startRobots: number;
  robotsPerLevel: number;
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { cols: 30, rows: 20, startRobots: 5, robotsPerLevel: 3 },
  medium: { cols: 24, rows: 16, startRobots: 8, robotsPerLevel: 4 },
  hard: { cols: 18, rows: 12, startRobots: 12, robotsPerLevel: 5 },
};

interface DaleksState {
  phase: GamePhase;
  difficulty: Difficulty;
  level: number;
  moveNumber: number;
  player: Position;
  robots: Robot[];
  piles: Pile[];
  teleportsRemaining: number;
  keyBindings: KeyBindings;
  cols: number;
  rows: number;
  nextRobotId: number;
  playerActed: boolean;
  animating: boolean;
  teleportFrom: Position | null;

  setPhase: (phase: GamePhase) => void;
  setDifficulty: (d: Difficulty) => void;
  startGame: () => void;
  startLevel: (level: number) => void;
  movePlayer: (direction: string) => void;
  stayInPlace: () => void;
  teleport: () => void;
  advanceLevel: () => void;
  setKeyBinding: (action: keyof KeyBindings, key: string) => void;
  resetKeyBindings: () => void;
  setAnimating: (a: boolean) => void;
}

function randomPos(cols: number, rows: number): Position {
  return {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows),
  };
}

function posKey(p: Position): string {
  return `${p.x},${p.y}`;
}

function posEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

function generateLevel(cols: number, rows: number, robotCount: number): { player: Position; robots: Robot[]; nextId: number } {
  const occupied = new Set<string>();
  const player = randomPos(cols, rows);
  occupied.add(posKey(player));

  const robots: Robot[] = [];
  let id = 1;
  for (let i = 0; i < robotCount; i++) {
    let pos: Position;
    let attempts = 0;
    do {
      pos = randomPos(cols, rows);
      attempts++;
    } while (occupied.has(posKey(pos)) && attempts < 1000);
    if (!occupied.has(posKey(pos))) {
      occupied.add(posKey(pos));
      robots.push({ id, pos, alive: true });
      id++;
    }
  }
  return { player, robots, nextId: id };
}

function moveRobots(robots: Robot[], piles: Pile[], playerPos: Position): { robots: Robot[]; piles: Pile[]; playerDead: boolean } {
  const newPositions: { robot: Robot; newPos: Position }[] = [];

  for (const robot of robots) {
    if (!robot.alive) continue;

    let dx = 0;
    let dy = 0;
    if (playerPos.x > robot.pos.x) dx = 1;
    else if (playerPos.x < robot.pos.x) dx = -1;
    if (playerPos.y > robot.pos.y) dy = 1;
    else if (playerPos.y < robot.pos.y) dy = -1;

    const newPos = { x: robot.pos.x + dx, y: robot.pos.y + dy };
    newPositions.push({ robot, newPos });
  }

  const updatedPiles = [...piles];
  const updatedRobots = robots.map((r) => ({ ...r }));
  let playerDead = false;

  for (const { newPos } of newPositions) {
    if (posEqual(newPos, playerPos)) {
      playerDead = true;
      break;
    }
  }

  const positionMap = new Map<string, number[]>();
  for (let i = 0; i < newPositions.length; i++) {
    const key = posKey(newPositions[i].newPos);
    if (!positionMap.has(key)) positionMap.set(key, []);
    positionMap.get(key)!.push(i);
  }

  positionMap.forEach((indices, _key) => {
    const pos = newPositions[indices[0]].newPos;
    const hitsPile = updatedPiles.some((p) => posEqual(p.pos, pos));

    if (indices.length > 1 || hitsPile) {
      for (const idx of indices) {
        const robotId = newPositions[idx].robot.id;
        const r = updatedRobots.find((ur) => ur.id === robotId);
        if (r) r.alive = false;
      }
      if (!hitsPile) {
        updatedPiles.push({ pos });
      }
    } else {
      const robotId = newPositions[indices[0]].robot.id;
      const r = updatedRobots.find((ur) => ur.id === robotId);
      if (r) r.pos = pos;
    }
  });

  return {
    robots: updatedRobots.filter((r) => r.alive),
    piles: updatedPiles,
    playerDead,
  };
}

export const useDaleks = create<DaleksState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    difficulty: "medium",
    level: 1,
    moveNumber: 0,
    player: { x: 0, y: 0 },
    robots: [],
    piles: [],
    teleportsRemaining: 3,
    keyBindings: getLocalStorage("daleksKeyBindings") || DEFAULT_KEY_BINDINGS,
    cols: 24,
    rows: 16,
    nextRobotId: 1,
    playerActed: false,
    animating: false,
    teleportFrom: null,

    setPhase: (phase) => set({ phase }),
    setAnimating: (a) => set({ animating: a }),

    setDifficulty: (d) => set({ difficulty: d }),

    startGame: () => {
      const { difficulty } = get();
      const config = DIFFICULTY_CONFIGS[difficulty];
      set({ cols: config.cols, rows: config.rows });
      get().startLevel(1);
    },

    startLevel: (level) => {
      const { difficulty } = get();
      const config = DIFFICULTY_CONFIGS[difficulty];
      const robotCount = config.startRobots + (level - 1) * config.robotsPerLevel;
      const maxRobots = Math.min(robotCount, config.cols * config.rows - 1);
      const { player, robots, nextId } = generateLevel(config.cols, config.rows, maxRobots);
      set({
        phase: "playing",
        level,
        moveNumber: 0,
        player,
        robots,
        piles: [],
        teleportsRemaining: 3,
        nextRobotId: nextId,
        playerActed: false,
        animating: false,
        teleportFrom: null,
        cols: config.cols,
        rows: config.rows,
      });
    },

    movePlayer: (direction) => {
      const state = get();
      if (state.phase !== "playing" || state.animating) return;

      const delta = DIRECTION_DELTAS[direction];
      if (!delta) return;

      const newX = state.player.x + delta.x;
      const newY = state.player.y + delta.y;

      if (newX < 0 || newX >= state.cols || newY < 0 || newY >= state.rows) return;

      const newPlayerPos = { x: newX, y: newY };

      const hitsExistingPile = state.piles.some((p) => posEqual(p.pos, newPlayerPos));
      if (hitsExistingPile) return;

      const walksIntoRobot = state.robots.some((r) => r.alive && posEqual(r.pos, newPlayerPos));
      if (walksIntoRobot) {
        set({
          player: newPlayerPos,
          moveNumber: state.moveNumber + 1,
          phase: "gameOver",
        });
        return;
      }

      const result = moveRobots(state.robots, state.piles, newPlayerPos);

      if (result.playerDead) {
        set({
          player: newPlayerPos,
          robots: result.robots,
          piles: result.piles,
          moveNumber: state.moveNumber + 1,
          phase: "gameOver",
        });
        return;
      }

      const allDead = result.robots.length === 0;
      set({
        player: newPlayerPos,
        robots: result.robots,
        piles: result.piles,
        moveNumber: state.moveNumber + 1,
        phase: allDead ? "levelCleared" : "playing",
      });
    },

    stayInPlace: () => {
      const state = get();
      if (state.phase !== "playing" || state.animating) return;

      const result = moveRobots(state.robots, state.piles, state.player);

      if (result.playerDead) {
        set({
          robots: result.robots,
          piles: result.piles,
          moveNumber: state.moveNumber + 1,
          phase: "gameOver",
        });
        return;
      }

      const allDead = result.robots.length === 0;
      set({
        robots: result.robots,
        piles: result.piles,
        moveNumber: state.moveNumber + 1,
        phase: allDead ? "levelCleared" : "playing",
      });
    },

    teleport: () => {
      const state = get();
      if (state.phase !== "playing" || state.teleportsRemaining <= 0 || state.animating) return;

      const oldPos = { ...state.player };

      let newPos: Position;
      let attempts = 0;
      let found = false;
      do {
        newPos = randomPos(state.cols, state.rows);
        attempts++;
        const occupied =
          state.piles.some((p) => posEqual(p.pos, newPos)) ||
          state.robots.some((r) => r.alive && posEqual(r.pos, newPos));
        if (!occupied) {
          found = true;
          break;
        }
      } while (attempts < 1000);

      if (!found) return;

      const result = moveRobots(state.robots, state.piles, newPos);

      if (result.playerDead) {
        set({
          player: newPos,
          robots: result.robots,
          piles: result.piles,
          teleportsRemaining: state.teleportsRemaining - 1,
          moveNumber: state.moveNumber + 1,
          phase: "gameOver",
          teleportFrom: oldPos,
        });
        return;
      }

      const allDead = result.robots.length === 0;
      set({
        player: newPos,
        robots: result.robots,
        piles: result.piles,
        teleportsRemaining: state.teleportsRemaining - 1,
        moveNumber: state.moveNumber + 1,
        phase: allDead ? "levelCleared" : "playing",
        teleportFrom: oldPos,
      });
    },

    advanceLevel: () => {
      const { level } = get();
      get().startLevel(level + 1);
    },

    setKeyBinding: (action, key) => {
      const bindings = { ...get().keyBindings, [action]: key.toLowerCase() };
      setLocalStorage("daleksKeyBindings", bindings);
      set({ keyBindings: bindings });
    },

    resetKeyBindings: () => {
      setLocalStorage("daleksKeyBindings", DEFAULT_KEY_BINDINGS);
      set({ keyBindings: DEFAULT_KEY_BINDINGS });
    },
  }))
);
