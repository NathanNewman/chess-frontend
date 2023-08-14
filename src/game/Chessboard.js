import React from "react";
import Square from "./Square";
import "./styles.css";

function Chessboard({
  board,
  playerColor,
  errorMessage,
  prevClickedSquare,
  handleClickedSquare,
}) {
  // Initial FEN strings representing the starting position for white and black
  const startingFEN =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0";

  // Function to render the chessboard with squares and pieces
  function renderBoard() {
    const rotatedBoard =
      playerColor === "black"
        ? [...board].reverse()
        : [...board].map((row) => [...row].reverse());

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

export default Chessboard;
