import { useDaleks } from "../lib/stores/useDaleks";

export default function StatusBar() {
  const { level, moveNumber, robots, teleportsRemaining, difficulty } = useDaleks();
  const aliveRobots = robots.filter((r) => r.alive).length;

  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="status-label">Level</span>
        <span className="status-value">{level}</span>
      </div>
      <div className="status-item">
        <span className="status-label">Move</span>
        <span className="status-value">{moveNumber}</span>
      </div>
      <div className="status-item">
        <span className="status-label">Robots</span>
        <span className="status-value">{aliveRobots}</span>
      </div>
      <div className="status-item">
        <span className="status-label">Teleports</span>
        <span className="status-value">{teleportsRemaining}</span>
      </div>
      <div className="status-item">
        <span className="status-label">Difficulty</span>
        <span className="status-value capitalize">{difficulty}</span>
      </div>
    </div>
  );
}
