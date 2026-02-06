import { useDaleks, type Difficulty } from "../lib/stores/useDaleks";

export default function MainMenu() {
  const { difficulty, setDifficulty, startGame, setPhase } = useDaleks();

  const difficulties: { value: Difficulty; label: string; desc: string }[] = [
    { value: "easy", label: "Easy", desc: "Large board, few robots" },
    { value: "medium", label: "Medium", desc: "Medium board, moderate robots" },
    { value: "hard", label: "Hard", desc: "Small board, many robots" },
  ];

  return (
    <div className="menu-screen">
      <h1 className="game-title">DALEKS</h1>
      <p className="game-subtitle">Survive the robots!</p>

      <div className="difficulty-selector">
        <h3>Difficulty</h3>
        <div className="difficulty-options">
          {difficulties.map((d) => (
            <button
              key={d.value}
              className={`diff-btn ${difficulty === d.value ? "active" : ""}`}
              onClick={() => setDifficulty(d.value)}
            >
              <span className="diff-label">{d.label}</span>
              <span className="diff-desc">{d.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <button className="menu-btn primary" onClick={startGame}>
        Start Game
      </button>

      <button className="menu-btn" onClick={() => setPhase("settings")}>
        Key Bindings
      </button>

      <div className="how-to-play">
        <h3>How to Play</h3>
        <ul>
          <li>Move in 8 directions to avoid robots</li>
          <li>Robots chase you each turn</li>
          <li>When robots collide, they are destroyed</li>
          <li>Lure robots into each other to win!</li>
          <li>Use teleport to escape (3 per level)</li>
        </ul>
      </div>
    </div>
  );
}
