import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { moveDown, moveLeft, moveRight, moveUp } from "../actions/index";
import { useEffect,useRef } from "react";
import { isGameOver } from "../reducers/functions";
import VanillaTilt from "vanilla-tilt";

// a cell component
const Cell = ({ number }) => (
  <div className={`cell number color-${number}`}>
    {number > 0 ? number : ""}
  </div>
);


// tilt component
function Tilt(props) {
  const { options, ...rest } = props;
  const tilt = useRef(null);

  useEffect(() => {
    VanillaTilt.init(tilt.current, options);
  }, [options]);

  return <div ref={tilt} {...rest} />;
}
const GameBoard = () => {
  // getting the board
  const board = useSelector((state) => state.gameBoard).board;
  const dispatch = useDispatch();

  //   keydown and what to perform
  const onKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        dispatch(moveLeft(board));
        break;
      case "ArrowRight":
        dispatch(moveRight(board));
        break;
      case "ArrowUp":
        dispatch(moveUp(board));
        break;
      case "ArrowDown":
        dispatch(moveDown(board));
        break;

      default:
        return;
    }
    let [isOver, reason] = isGameOver(board);
    // check if the game is over
    if (isOver) {
      alert(`game is over! you ${reason}`);
    }
  };
  //  tilt object
  const options = {
    scale: 1.2,
    speed: 1000,
    max: 30
  };
  //   addition and removal of event listener for moves
  useEffect(() => {
    
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function getTouches(evt) {
      return evt.touches ||             // browser API
        evt.originalEvent.touches; // jQuery
    }

    function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    };

    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
          /*to left swipe*/
          dispatch(moveLeft(board));
        } else {
          /* to right swipe */
          dispatch(moveRight(board));
        }
      } else {
        if (yDiff > 0) {
          /* to up swipe */
          dispatch(moveUp(board));
          
        } else {
          /* to down swipe */
          dispatch(moveDown(board));
        }
      }
      /* reset values */
      xDown = null;
      yDown = null;
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
  return (
    <Tilt className="game-board" options={options}>
      {board.map((row, i) => {
        return (
          <div key={`row-${i}`} className="row">
            {row.map((cell, j) => (
              <Cell key={`cell-${i}-${j}`} number={cell} />
            ))}
          </div>
        );
      })}
    </Tilt>
  );
};

export default GameBoard;
