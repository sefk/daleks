import { useState } from "react";
import { useDaleks, type KeyBindings } from "../lib/stores/useDaleks";

const ACTIONS: { key: keyof KeyBindings; label: string }[] = [
  { key: "north", label: "North (Up)" },
  { key: "northwest", label: "Northwest" },
  { key: "northeast", label: "Northeast" },
  { key: "west", label: "West (Left)" },
  { key: "east", label: "East (Right)" },
  { key: "southwest", label: "Southwest" },
  { key: "south", label: "South (Down)" },
  { key: "southeast", label: "Southeast" },
  { key: "stay", label: "Stay in Place" },
  { key: "teleport", label: "Teleport" },
];

export default function Settings() {
  const { keyBindings, setKeyBinding, resetKeyBindings, setPhase } = useDaleks();
  const [listening, setListening] = useState<keyof KeyBindings | null>(null);

  const handleKeyCapture = (action: keyof KeyBindings) => {
    setListening(action);
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      setKeyBinding(action, e.key);
      setListening(null);
      window.removeEventListener("keydown", handler);
    };
    window.addEventListener("keydown", handler);
  };

  return (
    <div className="menu-screen">
      <h2 className="settings-title">Key Bindings</h2>

      <div className="key-bindings-grid">
        {ACTIONS.map((a) => (
          <div key={a.key} className="key-binding-row">
            <span className="binding-label">{a.label}</span>
            <button
              className={`binding-key ${listening === a.key ? "listening" : ""}`}
              onClick={() => handleKeyCapture(a.key)}
            >
              {listening === a.key ? "Press a key..." : keyBindings[a.key].toUpperCase()}
            </button>
          </div>
        ))}
      </div>

      <div className="settings-actions">
        <button className="menu-btn" onClick={resetKeyBindings}>
          Reset to Defaults
        </button>
        <button className="menu-btn primary" onClick={() => setPhase("menu")}>
          Back to Menu
        </button>
      </div>
    </div>
  );
}
