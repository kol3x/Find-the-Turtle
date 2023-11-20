import React, { useState, useEffect } from "react";

function Timer({ gameStarted, gameOver }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let intervalId;

    if (gameStarted && !gameOver) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setTime(0);
    }

    return () => clearInterval(intervalId);
  }, [gameStarted, gameOver]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <div>
      <h1>{formattedTime}</h1>
    </div>
  );
}

export default Timer;

