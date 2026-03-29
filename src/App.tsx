import { useState } from "react";

type TargetId =
  | "top-left"
  | "top-center"
  | "top-right"
  | "mid-left"
  | "mid-center"
  | "mid-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type KeeperPose =
  | "idle"
  | "left-high"
  | "left-mid"
  | "left-low"
  | "center-high"
  | "center-mid"
  | "center-low"
  | "right-high"
  | "right-mid"
  | "right-low";

type TargetConfig = {
  id: TargetId;
  label: string;
  ballX: string;
  ballY: string;
  keeperPose: KeeperPose;
};

const TARGETS: TargetConfig[] = [
  {
    id: "top-left",
    label: "Top Left",
    ballX: "40%",
    ballY: "82px",
    keeperPose: "left-high",
  },
  {
    id: "top-center",
    label: "Top Center",
    ballX: "50%",
    ballY: "74px",
    keeperPose: "center-high",
  },
  {
    id: "top-right",
    label: "Top Right",
    ballX: "60%",
    ballY: "82px",
    keeperPose: "right-high",
  },
  {
    id: "mid-left",
    label: "Mid Left",
    ballX: "40%",
    ballY: "108px",
    keeperPose: "left-mid",
  },
  {
    id: "mid-center",
    label: "Mid Center",
    ballX: "50%",
    ballY: "104px",
    keeperPose: "center-mid",
  },
  {
    id: "mid-right",
    label: "Mid Right",
    ballX: "60%",
    ballY: "108px",
    keeperPose: "right-mid",
  },
  {
    id: "bottom-left",
    label: "Bottom Left",
    ballX: "40%",
    ballY: "138px",
    keeperPose: "left-low",
  },
  {
    id: "bottom-center",
    label: "Bottom Center",
    ballX: "50%",
    ballY: "138px",
    keeperPose: "center-low",
  },
  {
    id: "bottom-right",
    label: "Bottom Right",
    ballX: "60%",
    ballY: "138px",
    keeperPose: "right-low",
  },
];

const TARGET_MAP: Record<TargetId, TargetConfig> = {
  "top-left": TARGETS[0],
  "top-center": TARGETS[1],
  "top-right": TARGETS[2],
  "mid-left": TARGETS[3],
  "mid-center": TARGETS[4],
  "mid-right": TARGETS[5],
  "bottom-left": TARGETS[6],
  "bottom-center": TARGETS[7],
  "bottom-right": TARGETS[8],
};

function getRandomTarget(): TargetConfig {
  return TARGETS[Math.floor(Math.random() * TARGETS.length)];
}

function isSaved(shotTarget: TargetId, keeperTarget: TargetId): boolean {
  if (shotTarget === keeperTarget) {
    return true;
  }

  const partialSaveMap: Record<TargetId, TargetId[]> = {
    "top-left": ["mid-left"],
    "top-center": ["mid-center"],
    "top-right": ["mid-right"],
    "mid-left": ["top-left", "bottom-left"],
    "mid-center": ["top-center", "bottom-center"],
    "mid-right": ["top-right", "bottom-right"],
    "bottom-left": ["mid-left"],
    "bottom-center": ["mid-center"],
    "bottom-right": ["mid-right"],
  };

  const neighboringCoverage = partialSaveMap[keeperTarget];

  return neighboringCoverage.includes(shotTarget);
}

export default function App() {
  const [ballX, setBallX] = useState("50%");
  const [ballY, setBallY] = useState("calc(100% - 40px)");
  const [keeperPose, setKeeperPose] = useState<KeeperPose>("idle");
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [message, setMessage] = useState("Click a square inside the goal to shoot.");
  const [isShooting, setIsShooting] = useState(false);
  const [lastAim, setLastAim] = useState<string>("None");
  const [lastKeeper, setLastKeeper] = useState<string>("None");

  function resetBall() {
    setBallX("50%");
    setBallY("calc(100% - 40px)");
  }

  function resetKeeper() {
    setKeeperPose("idle");
  }

  function takeShot(targetId: TargetId) {
    if (isShooting) return;

    setIsShooting(true);

    const shotTarget = TARGET_MAP[targetId];
    const keeperTarget = getRandomTarget();

    setLastAim(shotTarget.label);
    setLastKeeper(keeperTarget.label);

    setBallX(shotTarget.ballX);
    setBallY(shotTarget.ballY);

    window.setTimeout(() => {
      setKeeperPose(keeperTarget.keeperPose);

      setShots((prev) => prev + 1);

      if (isSaved(shotTarget.id, keeperTarget.id)) {
        setMessage(`Saved! You aimed ${shotTarget.label}. Keeper covered ${keeperTarget.label}.`);
      } else {
        setScore((prev) => prev + 1);
        setMessage(`Goal! You aimed ${shotTarget.label}. Keeper went ${keeperTarget.label}.`);
      }

      window.setTimeout(() => {
        resetBall();
        resetKeeper();
        setIsShooting(false);
      }, 900);
    }, 120);
  }

  const savePercentage = shots === 0 ? 0 : Math.round(((shots - score) / shots) * 100);
  const goalPercentage = shots === 0 ? 0 : Math.round((score / shots) * 100);

  return (
    <div className="app">
      <h1>Football Penalty Game</h1>

      <div className="scoreboard">
        <div className="stat-card">
          <span className="stat-label">Goals</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Shots</span>
          <span className="stat-value">{shots}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Goal %</span>
          <span className="stat-value">{goalPercentage}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Save %</span>
          <span className="stat-value">{savePercentage}%</span>
        </div>
      </div>

      <div className="info-panel">
        <p>{message}</p>
        <div className="info-row">
          <span>
            <strong>Last Aim:</strong> {lastAim}
          </span>
          <span>
            <strong>Keeper Cover:</strong> {lastKeeper}
          </span>
        </div>
      </div>

      <div className="game-area">
        <div className="field-line center-line"></div>
        <div className="field-circle"></div>
        <div className="penalty-box"></div>
        <div className="penalty-spot"></div>

        <div className="goal">
          <div className="goal-net"></div>

          <div className="goal-grid">
            {TARGETS.map((target) => (
              <button
                key={target.id}
                className="goal-cell"
                onClick={() => takeShot(target.id)}
                disabled={isShooting}
                aria-label={`Shoot ${target.label}`}
                title={target.label}
              />
            ))}
          </div>
        </div>

        <div className={`keeper keeper-${keeperPose}`}>
          <div className="keeper-head"></div>
          <div className="keeper-body"></div>
          <div className="keeper-arm keeper-arm-left"></div>
          <div className="keeper-arm keeper-arm-right"></div>
          <div className="keeper-leg keeper-leg-left"></div>
          <div className="keeper-leg keeper-leg-right"></div>
        </div>

        <div
          className={`ball ${isShooting ? "ball-shot" : ""}`}
          style={{
            left: ballX,
            top: ballY,
          }}
        ></div>
      </div>

      <button
        className="reset-button"
        onClick={() => {
          setScore(0);
          setShots(0);
          setMessage("Click a square inside the goal to shoot.");
          setLastAim("None");
          setLastKeeper("None");
          resetBall();
          resetKeeper();
          setIsShooting(false);
        }}
      >
        Reset Game
      </button>
    </div>
  );
}