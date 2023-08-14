import React, { useState, useEffect, useContext } from "react";
import { Chess } from "chess.js";
import { addConsecutiveNumbers, findMissingPieces } from "../helpers/chess.js";
import { AuthContext } from "../helpers/AuthContext";
import Chessboard from "./Chessboard";
import ChessApi from "../helpers/api.js";
import { useParams } from "react-router-dom";

function ReplayMatch() {
  // Initial FEN strings representing the starting position for white and black
  // FEN stands for Forsyth-Edwards Notation. It is a standard notation used to describe the current position of a chessboard.
  const startingFEN =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0";

  // State to keep track of the chessboard and piece positions
  const [board, setBoard] = useState([]);

  // FEN states
  const [piecePlacement, setPiecePlacement] = useState("");
  const [activeColor, setActiveColor] = useState("");
  const [castlingAvailability, setCastlingAvailability] = useState("");
  const [enPassantTarget, setEnPassantTarget] = useState("");
  const [halfmoveClock, setHalfmoveClock] = useState("");
  const [fullmoveNumber, setFullmoveNumber] = useState("");

  // Game states
  const [playerColor, setPlayerColor] = useState("white");
  const [endingMessage, setEndingMessage] = useState("");
  const [moveHistory, setMoveHistory] = useState([]);
  const { username, elo, setElo } = useContext(AuthContext);
  const [piecesTaken, setPiecesTaken] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const { matchId } = useParams();

  function parseFEN(fen) {
    const [position, color, castlingEnPassant, dash, halfMove, fullMove] =
      fen.split(" "); // Split FEN into position and additional info
    const rows = position.split("/");
    const castling = castlingEnPassant.slice(0, 2);
    const enPassant = castlingEnPassant.slice(2, 4);

    // set FEN states
    setPiecePlacement(position);
    setActiveColor(color);
    setCastlingAvailability(castling);
    setEnPassantTarget(enPassant);
    setHalfmoveClock(parseInt(halfMove) + 1);
    setFullmoveNumber(parseInt(fullMove) + 1);

    return rows.map((row) => {
      let expandedRow = "";
      let emptySquares = 0;

      for (const char of row) {
        if (!isNaN(char)) {
          emptySquares += parseInt(char);
        } else {
          if (emptySquares > 0) {
            expandedRow += "1".repeat(emptySquares);
            emptySquares = 0;
          }
          expandedRow += char;
        }
      }

      if (emptySquares > 0) {
        expandedRow += "1".repeat(emptySquares);
      }

      return expandedRow.split("").filter((char) => char !== ",");
    });
  }

  function boardToFEN(board) {
    const fenRows = board.map((row) =>
      row.map((piece) => (piece === null ? "1" : piece)).join("")
    );
    const addedFENRows = addConsecutiveNumbers(fenRows);
    return (
      addedFENRows.join("/") +
      " " +
      activeColor +
      " " +
      castlingAvailability +
      enPassantTarget +
      " - " +
      halfmoveClock +
      " " +
      fullmoveNumber
    );
  }

  useEffect(() => {
    if (!username) return;
    // Set the initial board state with a random starting position
    setBoard(parseFEN(startingFEN));
    const getReplays = async () => {
      try {
        const data = await ChessApi.replayGame(matchId);
        console.log(data);
      } catch (error) {
        console.error("Error fetching replay data:", error);
      }
    };

    getReplays();
  }, []);

  function handleMovePiece(fromSquare, toSquare) {
    const chess = new Chess(); // Create a new chess instance

    // Load the board state using the current FEN
    chess.load(boardToFEN(board));

    try {
      // Check if the move is valid using chess.js move validation
      const move = {
        from: fromSquare,
        to: toSquare,
        promotion: "q", // Always promote to a queen for simplicity
      };

      // If the moved piece is a pawn and it reached the last rank, set the promotion piece
      if (
        chess.get(fromSquare.row, fromSquare.col).type === "p" &&
        (toSquare.row === 0 || toSquare.row === 7)
      ) {
        move.promotion = "q";
      }
      if (
        chess.get(fromSquare.row, fromSquare.col).type === "P" &&
        (toSquare.row === 0 || toSquare.row === 7)
      ) {
        move.promotion = "Q";
      }
      const updatedBoard = parseFEN(chess.fen()); // Get the updated FEN
      setBoard(updatedBoard); // Update the board state
      if (findMissingPieces(updatedBoard) !== piecesTaken) {
        setPiecesTaken(findMissingPieces(updatedBoard));
        setHalfmoveClock(0);
      }
      if (chess.isCheckmate()) {
        if (playerColor[0] === activeColor) {
          setEndingMessage("Checkmate! You win!");
        } else {
          setEndingMessage("Checkmate! You lose!");
        }
      } else if (chess.isStalemate()) {
        if (playerColor[0] === activeColor) {
          setEndingMessage("Stalemate! You win!");
        } else {
          setEndingMessage("Stalemate! You lose!");
        }
      } else if (halfmoveClock === 50) {
        setEndingMessage("Draw! Game over.");
      } else if (chess.isCheck()) {
        setErrorMessage("Check!");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      // Handle any errors that occur during move validation
      console.error("Error occurred during move validation:", error);
      setErrorMessage("Invalid move, please try again.");
      // Reset the error message after a short delay (e.g., 5 seconds)
      setTimeout(() => setErrorMessage(""), 5000);
    }
  }
  return (
    <div style={{ marginTop: "-30px" }}>
      {activeColor === playerColor[0] ? (
        <p>It's your turn!</p>
      ) : (
        <p>AI's turn!</p>
      )}
      <div className="chess-game-container">
        <div className="chessboard-container">
          <Chessboard
            board={board}
            playerColor={playerColor}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default ReplayMatch;
