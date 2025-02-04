import React from "react";
import { useSelector } from "react-redux";

const Score = () => {
  // getting the score and highscore state from the state
  const score = useSelector((state) => state.gameBoard).score;
  const highScore = useSelector((state) => state.gameBoard).highScore;
  return (
    <div>
      {score} {highScore}
    </div>
  );
};

export default Score;
