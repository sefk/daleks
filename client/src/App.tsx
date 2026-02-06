import { useDaleks } from "./lib/stores/useDaleks";
import MainMenu from "./components/MainMenu";
import Settings from "./components/Settings";
import GameBoard from "./components/GameBoard";
import StatusBar from "./components/StatusBar";
import "@fontsource/inter";

function App() {
  const phase = useDaleks((s) => s.phase);

  return (
    <div className="app-container">
      {phase === "menu" && <MainMenu />}
      {phase === "settings" && <Settings />}
      {(phase === "playing" || phase === "levelCleared" || phase === "gameOver") && (
        <div className="game-container">
          <StatusBar />
          <GameBoard />
        </div>
      )}
    </div>
  );
}

export default App;
