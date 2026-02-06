import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { useDaleks, type Position } from "../lib/stores/useDaleks";
import PlayerSprite from "./sprites/PlayerSprite";
import DalekSprite from "./sprites/DalekSprite";
import PileSprite from "./sprites/PileSprite";

function posKey(p: Position): string {
  return `${p.x},${p.y}`;
}

const MOVE_DURATION = 200;
const ROBOT_DELAY = 80;
const TELEPORT_DURATION = 400;

const DIRECTION_ARROWS: { direction: string; dx: number; dy: number; label: string }[] = [
  { direction: "northwest", dx: -1, dy: -1, label: "\u2196" },
  { direction: "north", dx: 0, dy: -1, label: "\u2191" },
  { direction: "northeast", dx: 1, dy: -1, label: "\u2197" },
  { direction: "west", dx: -1, dy: 0, label: "\u2190" },
  { direction: "east", dx: 1, dy: 0, label: "\u2192" },
  { direction: "southwest", dx: -1, dy: 1, label: "\u2199" },
  { direction: "south", dx: 0, dy: 1, label: "\u2193" },
  { direction: "southeast", dx: 1, dy: 1, label: "\u2198" },
];

interface TeleportEffect {
  from: Position;
  to: Position;
  startTime: number;
}

export default function GameBoard() {
  const {
    phase, player, robots, piles, cols, rows,
    keyBindings, movePlayer, stayInPlace, teleport, advanceLevel,
    teleportsRemaining, teleportFrom, setAnimating, animating,
  } = useDaleks();

  const [teleportEffect, setTeleportEffect] = useState<TeleportEffect | null>(null);
  const prevMoveRef = useRef(useDaleks.getState().moveNumber);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAnimTimer = useCallback(() => {
    if (animTimerRef.current !== null) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (phase === "menu" || phase === "settings") {
      clearAnimTimer();
      setAnimating(false);
      setTeleportEffect(null);
    }
  }, [phase, clearAnimTimer, setAnimating]);

  useEffect(() => {
    return () => {
      clearAnimTimer();
      setAnimating(false);
    };
  }, [clearAnimTimer, setAnimating]);

  useEffect(() => {
    const state = useDaleks.getState();
    if (state.moveNumber !== prevMoveRef.current) {
      const isTeleport = state.teleportFrom !== null;
      prevMoveRef.current = state.moveNumber;
      clearAnimTimer();

      if (isTeleport && state.teleportFrom) {
        setAnimating(true);
        setTeleportEffect({
          from: state.teleportFrom,
          to: state.player,
          startTime: Date.now(),
        });
        useDaleks.setState({ teleportFrom: null });
        const totalDuration = TELEPORT_DURATION + 2 * 80 + TELEPORT_DURATION;
        animTimerRef.current = setTimeout(() => {
          setTeleportEffect(null);
          setAnimating(false);
          animTimerRef.current = null;
        }, totalDuration);
      } else {
        setAnimating(true);
        animTimerRef.current = setTimeout(() => {
          setAnimating(false);
          animTimerRef.current = null;
        }, MOVE_DURATION + ROBOT_DELAY + 50);
      }
    }
  }, [player, robots, piles, setAnimating, clearAnimTimer]);

  const keyToDirection = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [dir, key] of Object.entries(keyBindings)) {
      if (dir !== "teleport" && dir !== "stay") {
        map[key.toLowerCase()] = dir;
      }
    }
    return map;
  }, [keyBindings]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phase === "levelCleared") {
        advanceLevel();
        return;
      }
      if (phase !== "playing") return;

      const key = e.key.toLowerCase();

      if (key === keyBindings.teleport.toLowerCase()) {
        teleport();
        return;
      }

      if (key === keyBindings.stay.toLowerCase()) {
        stayInPlace();
        return;
      }

      const dir = keyToDirection[key];
      if (dir) {
        movePlayer(dir);
      }
    },
    [phase, keyBindings, keyToDirection, movePlayer, stayInPlace, teleport, advanceLevel]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const pileSet = useMemo(() => {
    const s = new Set<string>();
    for (const p of piles) s.add(posKey(p.pos));
    return s;
  }, [piles]);

  const arrowPositions = useMemo(() => {
    if (phase !== "playing") return [];
    return DIRECTION_ARROWS.map((a) => ({
      ...a,
      x: player.x + a.dx,
      y: player.y + a.dy,
    })).filter(
      (a) => a.x >= 0 && a.x < cols && a.y >= 0 && a.y < rows && !pileSet.has(`${a.x},${a.y}`)
    );
  }, [phase, player, cols, rows, pileSet]);

  const arrowSet = useMemo(() => {
    const m = new Map<string, typeof DIRECTION_ARROWS[0]>();
    for (const a of arrowPositions) {
      m.set(`${a.x},${a.y}`, a);
    }
    return m;
  }, [arrowPositions]);

  const cellSize = useMemo(() => {
    const maxW = (window.innerWidth - 40) / cols;
    const maxH = (window.innerHeight - 120) / rows;
    return Math.max(16, Math.min(36, Math.floor(Math.min(maxW, maxH))));
  }, [cols, rows]);

  const isTeleporting = teleportEffect !== null;

  const gridRows = useMemo(() => {
    const result: JSX.Element[] = [];
    for (let y = 0; y < rows; y++) {
      const cells: JSX.Element[] = [];
      for (let x = 0; x < cols; x++) {
        const key = `${x},${y}`;
        const isPlayer = player.x === x && player.y === y;
        const arrow = arrowSet.get(key);

        let cellContent: React.ReactNode = null;
        let cellClass = "game-cell";

        if (isPlayer) {
          cellClass += " cell-player";
        } else if (arrow) {
          cellContent = arrow.label;
          cellClass += " cell-arrow";
        }

        cells.push(
          <div
            key={key}
            className={cellClass}
            style={{
              width: cellSize,
              height: cellSize,
              fontSize: cellSize * 0.6,
              lineHeight: `${cellSize}px`,
            }}
            onClick={() => {
              if (isPlayer && phase === "playing") {
                stayInPlace();
              } else if (arrow && phase === "playing") {
                movePlayer(arrow.direction);
              }
            }}
            title={isPlayer && phase === "playing" ? "Stay in place" : undefined}
          >
            {cellContent}
          </div>
        );
      }
      result.push(
        <div key={y} className="game-row">
          {cells}
        </div>
      );
    }
    return result;
  }, [rows, cols, player, arrowSet, cellSize, phase, movePlayer, stayInPlace]);

  return (
    <div className="game-board-wrapper">
      <div
        className="game-board"
        style={{
          width: cols * cellSize,
          height: rows * cellSize,
        }}
      >
        {gridRows}

        <div className="entity-layer">
          {piles.map((pile) => (
            <div
              key={posKey(pile.pos)}
              className="entity entity-pile"
              style={{
                left: pile.pos.x * cellSize,
                top: pile.pos.y * cellSize,
                width: cellSize,
                height: cellSize,
              }}
            >
              <PileSprite size={cellSize} />
            </div>
          ))}

          {robots.filter((r) => r.alive).map((robot) => (
            <div
              key={robot.id}
              className={`entity entity-robot ${isTeleporting ? "no-transition" : ""}`}
              style={{
                left: robot.pos.x * cellSize,
                top: robot.pos.y * cellSize,
                width: cellSize,
                height: cellSize,
                transition: isTeleporting
                  ? "none"
                  : `left ${MOVE_DURATION}ms ease-out ${ROBOT_DELAY}ms, top ${MOVE_DURATION}ms ease-out ${ROBOT_DELAY}ms`,
              }}
            >
              <DalekSprite size={cellSize} />
            </div>
          ))}

          <div
            className={`entity entity-player ${isTeleporting ? "teleporting" : ""}`}
            style={{
              left: player.x * cellSize,
              top: player.y * cellSize,
              width: cellSize,
              height: cellSize,
              transition: isTeleporting
                ? "none"
                : `left ${MOVE_DURATION}ms ease-out, top ${MOVE_DURATION}ms ease-out`,
            }}
          >
            <PlayerSprite size={cellSize} />
          </div>

          {teleportEffect && (
            <>
              <TeleportCircles
                pos={teleportEffect.from}
                cellSize={cellSize}
                expanding={true}
                duration={TELEPORT_DURATION}
              />
              <TeleportCircles
                pos={teleportEffect.to}
                cellSize={cellSize}
                expanding={false}
                duration={TELEPORT_DURATION}
              />
            </>
          )}
        </div>
      </div>

      {phase === "playing" && (
        <div className="action-buttons">
          <button
            className="stay-btn"
            onClick={() => stayInPlace()}
          >
            Stay ({keyBindings.stay.toUpperCase()})
          </button>
          {teleportsRemaining > 0 && (
            <button
              className="teleport-btn"
              onClick={() => teleport()}
            >
              Teleport ({teleportsRemaining})
            </button>
          )}
        </div>
      )}

      {phase === "levelCleared" && (
        <div className="overlay-message">
          <h2>Level Cleared!</h2>
          <p>Press any key to continue</p>
        </div>
      )}

      {phase === "gameOver" && (
        <div className="overlay-message game-over">
          <h2>Game Over!</h2>
          <p>A robot caught you.</p>
          <button
            className="menu-btn"
            onClick={() => useDaleks.getState().setPhase("menu")}
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}

function TeleportCircles({
  pos,
  cellSize,
  expanding,
  duration,
}: {
  pos: Position;
  cellSize: number;
  expanding: boolean;
  duration: number;
}) {
  const cx = pos.x * cellSize + cellSize / 2;
  const cy = pos.y * cellSize + cellSize / 2;
  const maxRadius = cellSize * 1.5;

  return (
    <div className="teleport-circles-container">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`teleport-circle ${expanding ? "circle-expand" : "circle-collapse"}`}
          style={{
            left: cx,
            top: cy,
            width: 0,
            height: 0,
            animationDuration: `${duration}ms`,
            animationDelay: `${expanding ? i * 80 : (duration + i * 80)}ms`,
            // @ts-ignore
            "--max-size": `${maxRadius * 2 * (1 - i * 0.25)}px`,
          }}
        />
      ))}
    </div>
  );
}
