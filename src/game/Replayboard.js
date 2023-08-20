import React from "react";
import Square from "./Square";
import "./styles.css";

function Replayboard({
  board,
  playerColor,
  errorMessage,
  prevClickedSquare,
  handleClickedSquare,
}) {

  // Function to render the chessboard with squares and pieces
  function renderBoard() {
    const rotatedBoard =
      playerColor === "black"
        ? [...board].reverse().map((row => [...row].reverse()))
        : [...board].map((row) => [...row]);

    return rotatedBoard.map((row, rowIndex) => (
      <div className="chessboard-row" key={rowIndex}>
        {row.map((piece, colIndex) => {
          const rotatedRowIndex =
            playerColor === "black" ? 7 - rowIndex : rowIndex;
          const rotatedColIndex =
            playerColor === "black" ? colIndex : 7 - colIndex;

          if (piece === "1") {
            return (
              <Square
                key={`${rowIndex}-${colIndex}`}
                piece={null}
                onClick={() =>
                  handleClickedSquare(rotatedRowIndex, rotatedColIndex)
                }
                isDarkSquare={(rowIndex + colIndex) % 2 !== 0}
                isSelected={
                  prevClickedSquare &&
                  prevClickedSquare.row === rotatedRowIndex &&
                  prevClickedSquare.col === rotatedColIndex
                }
              />
            );
          } else {
            return (
              <Square
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                onClick={() =>
                  handleClickedSquare(rotatedRowIndex, rotatedColIndex)
                }
                isDarkSquare={(rowIndex + colIndex) % 2 !== 0}
                isSelected={
                  prevClickedSquare &&
                  prevClickedSquare.row === rotatedRowIndex &&
                  prevClickedSquare.col === rotatedColIndex
                }
              />
            );
          }
        })}
      </div>
    ));
  }

  return (
    <div>
      <div className="chessboard">{renderBoard()}</div>
      {errorMessage && <div style={{ color: "red" }} >{errorMessage}</div>}
    </div>
  );
}

export default Replayboard;