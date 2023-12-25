import { useState } from "react";
import "./gameField.css";
import { clearSelection } from "./utils";

const BACKEND_URL = process.env.BACKEND_URL;

function GameField({
  setUpdate,
  options,
  gameOver,
  setGameOver,
  setGameStarted,
}) {
  const [missed, setMissed] = useState(false);
  const [timer, setTimer] = useState(0);
  const [username, setUsername] = useState("");
  function createSelection(x, y) {
    // Create circle
    const circle = document.createElement("div");
    circle.classList.add("circle");
    const circleSide = 100;
    circle.style.height = `${circleSide}px`;
    circle.style.width = `${circleSide}px`;
    circle.style.left = `${x - circleSide / 2}px`;
    circle.style.top = `${y - circleSide / 2}px`;
    // Create choice window
    const choice = document.createElement("div");
    choice.classList.add("choice");
    const choiceHeight = options.length * 25;
    const choiceWidth = 200;
    choice.style.height = `${choiceHeight}px`;
    choice.style.width = `${choiceWidth}px`;
    // If choice window breaks edges of the screen, move it to a different position
    if (x + choiceWidth > screen.width) {
      choice.style.left = `${x - circleSide / 2 - choiceWidth}px`;
    } else {
      choice.style.left = `${x + circleSide / 2}px`;
    }
    if (y < choiceHeight) {
      choice.style.top = `${y + circleSide / 2}px`;
    } else {
      choice.style.top = `${y - circleSide / 2 - choiceHeight}px`;
    }
    // TODO: add options to a choice window
    options.forEach((option) => {
      const optionForm = document.createElement("form");
      const cordsInput = document.createElement("input");
      cordsInput.value = [x, y];
      cordsInput.name = "cords";
      cordsInput.type = "hidden";
      const characterInput = document.createElement("input");
      characterInput.value = option;
      characterInput.name = "character";
      characterInput.type = "hidden";
      const characterButton = document.createElement("button");
      characterButton.textContent = option;
      optionForm.appendChild(cordsInput);
      optionForm.appendChild(characterInput);
      optionForm.appendChild(characterButton);
      optionForm.onsubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${BACKEND_URL}/turn`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            choice: e.target.character.value,
            coordinates: e.target.cords.value,
          }),
        });
        const data = await response.json();
        if (data.gameIsOver) {
          setGameOver(true);
          setTimer(data.timer);
        } else if (data.missed) {
          setMissed(true);
        } else {
          setMissed(false);
        }
        setUpdate((v) => v + 1);
        clearSelection();
      };
      choice.appendChild(optionForm);
    });
    // Append circle and choice window
    document.body.appendChild(circle);
    document.body.appendChild(choice);
  }

  if (gameOver) {
    return (
      <div className="gameField">
        <h1 className="winScreen">
          GAME OVER! YOU WON! It took you {timer} seconds.
        </h1>
        <h1>Write your username below to save your record</h1>
        <form
          className="userForm"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await fetch(`${BACKEND_URL}/add-record`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  username: username,
                  timer: timer,
                }),
              });

              setGameStarted(false);
              clearSelection();
            } catch (error) {
              console.error("Error submitting the form:", error);
            }
          }}
        >
          <input
            type="text"
            placeholder="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <button type="submit">SAVE</button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="gameField">
        <h1>
          {missed
            ? "Bad call... Try again."
            : "Pick a target and choose the character."}
        </h1>

        <img
          draggable="false"
          src="https://cdnb.artstation.com/p/assets/images/images/048/399/035/large/thomas-mitchell-img-3784.jpg"
          onClick={async (e) => {
            if (document.querySelector(".circle")) {
              await clearSelection();
            } else {
              createSelection(e.pageX, e.pageY);
            }
          }}
        ></img>
      </div>
    );
  }
}

export default GameField;
