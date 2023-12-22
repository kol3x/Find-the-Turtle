import { useEffect, useState } from "react";
import "./App.css";
import GameField from "./gameField";
import { clearSelection } from "./utils";
import Timer from "./timer";
import Records from "./records";

const BACKEND_URL = process.env.BACKEND_URL;

function App() {
  const [gameOver, setGameOver] = useState(false);
  const [update, setUpdate] = useState(0);
  const [options, setOptions] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [records, setRecords] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BACKEND_URL}/update`);
      const data = await response.json();
      const choices = data.choices;
      setOptions(choices);
    };

    fetchData();
  }, [update]);

  async function gameStart() {
    const response = await fetch(`${BACKEND_URL}/start`);
    const data = await response.json();
    const choices = data.choices;
    setOptions(choices);
    setUpdate((v) => v + 1);
  }

  return (
    <div className="main">
      <div className="menu">
        <button onClick={() => setRecords((el) => !el)}>
          {records ? "Back to game" : "Best results"}
        </button>
        <h2 className="timer">
          <Timer gameStarted={gameStarted} gameOver={gameOver} />
        </h2>
        <button
          onClick={() => {
            setGameStarted(false);
            clearSelection();
          }}
        >
          Restart
        </button>
      </div>
      {records && <Records gameOver={gameOver} records={records} />}
      {gameStarted && (
        <GameField
          setUpdate={setUpdate}
          options={options}
          gameOver={gameOver}
          setGameOver={setGameOver}
          setGameStarted={setGameStarted}
        />
      )}
      {!gameStarted && !records && (
        <button
          className="startButton"
          onClick={() => {
            setGameOver(false);
            setGameStarted(true);
            gameStart();
          }}
        >
          START
        </button>
      )}
    </div>
  );
}

export default App;
