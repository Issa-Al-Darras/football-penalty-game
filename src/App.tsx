import { useState } from "react";

type Direction = "left" | "center" | "right";

export default function App() {
  const [ballX, setBallX] = useState("50%");
  const [ballY, setBallY] = useState("calc(100% - 40px)");
  const [keeperX, setKeeperX] = useState("50%");
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [message, setMessage] = useState("Take the first shot.");
  const [isShooting, setIsShooting] = useState(false);

  function resetBall() {
    setBallX("50%");
    setBallY("calc(100% - 40px)");
  }

  function resetKeeper() {
    setKeeperX("50%");
  }

  function shoot(direction: Direction) {
    if (isShooting) return;

    setIsShooting(true);

    let shotX = "50%";
    let shotY = "140px";

    if (direction === "left") {
      shotX = "35%";
      shotY = "140px";
    } else if (direction === "center") {
      shotX = "50%";
      shotY = "110px";
    } else {
      shotX = "65%";
      shotY = "140px";
    }

    setBallX(shotX);
    setBallY(shotY);

    const directions: Direction[] = ["left", "center", "right"];
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];

    let newKeeperX = "50%";

    if (randomDirection === "left") {
      newKeeperX = "38%";
    } else if (randomDirection === "center") {
      newKeeperX = "50%";
    } else {
      newKeeperX = "62%";
    }

    setKeeperX(newKeeperX);
    setShots((prev) => prev + 1);

    if (randomDirection === direction) {
      setMessage("Saved!");
    } else {
      setScore((prev) => prev + 1);
      setMessage("Goal!");
    }

    setTimeout(() => {
      resetBall();
      resetKeeper();
      setIsShooting(false);
    }, 1000);
  }

  return (
    <div className="app">
      <h1>Football Penalty Game</h1>

      <div className="scoreboard">
        <p>Goals: {score}</p>
        <p>Shots: {shots}</p>
        <p>{message}</p>
      </div>

      <div className="game-area">
        <div className="goal"></div>

        <div
          className="keeper"
          style={{
            left: keeperX,
          }}
        >
          🧤
        </div>

        <div
          className="ball"
          style={{
            left: ballX,
            top: ballY,
          }}
        ></div>
      </div>

      <div className="controls">
        <button onClick={() => shoot("left")} disabled={isShooting}>
          Shoot Left
        </button>
        <button onClick={() => shoot("center")} disabled={isShooting}>
          Shoot Center
        </button>
        <button onClick={() => shoot("right")} disabled={isShooting}>
          Shoot Right
        </button>
      </div>
    </div>
  );
}