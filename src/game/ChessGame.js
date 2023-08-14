import React, { useState, useEffect, useContext } from "react";
import Chessboard from "./Chessboard";
import {
  toAlgebraicNotation,
  getRandomBoolean,
  addConsecutiveNumbers,
  findMissingPieces,
  adjustDifficulty,
} from "../helpers/chess.js";
import { Chess } from "chess.js";
import { AuthContext } from "../helpers/AuthContext";
import ChessApi from "../helpers/api";
import "./styles.css";
import PlayAgain from "./PlayAgain";
import GameInfoDisplay from "./GameInfoDisplay";

function ChessGame() {
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
  const [errorMessage, setErrorMessage] = useState("");
  const [prevClickedSquare, setPrevClickedSquare] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [piecesTaken, setPiecesTaken] = useState({});
  const [stockfishEngine, setStockfishEngine] = useState(null);
  const { username, elo, setElo } = useContext(AuthContext);
  const [gameOver, setGameOver] = useState(false);
  const [endingMessage, setEndingMessage] = useState("");
  const [difficulty, setDifficulty] = useState("1");
  const aiColor = playerColor === "white" ? "black" : "white";

  // Function to parse the FEN string and convert it to a 2D array representing the board state
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

  function handleClickedSquare(rowIndex, colIndex) {
    if (gameOver) return;
    let piece = board[rowIndex][colIndex];
    if (piece === "1") {
      setPrevClickedSquare(null);
    } else if (piece === piece.toUpperCase()) {
      piece = "w";
    } else if (piece === piece.toLowerCase()) {
      piece = "b";
    } else setPrevClickedSquare(null);
    if (piece === activeColor || prevClickedSquare !== null) {
      if (prevClickedSquare !== null) {
        const fromSquare = toAlgebraicNotation(
          prevClickedSquare.row,
          prevClickedSquare.col
        ); // The square from which the piece is moved
        const toSquare = toAlgebraicNotation(rowIndex, colIndex); // The square to which the piece is moved
        handleMovePiece(fromSquare, toSquare);
      } else {
        // If no previously clicked square, set the current square as the previously clicked square
        setPrevClickedSquare({ row: rowIndex, col: colIndex });
      }
    }
  }

  async function makeAIMove() {
    if (gameOver) return;
    if (!stockfishEngine) return;

    try {
      // Get the FEN position from the current board state
      const fenPosition = boardToFEN(board);

      // Send commands to stockfish to calculate the AI move
      stockfishEngine.postMessage(`position fen ${fenPosition}`);
      stockfishEngine.postMessage(`go depth ${difficulty}`); // You can adjust the depth as needed

      stockfishEngine.onmessage = (event) => {
        const message = event.data;
        if (message.startsWith("bestmove")) {
          const bestMove = message.split(" ")[1];
          // If AI move is valid, handle the AI move just like the player's move
          if (bestMove && bestMove.length === 4) {
            const fromSquare = bestMove.slice(0, 2);
            const toSquare = bestMove.slice(2, 4);
            handleMovePiece(fromSquare, toSquare);
          }
        }
      };
    } catch (error) {
      // Handle any errors that occur during AI move retrieval
      console.error("Error occurred during AI move retrieval:", error);
    }
  }

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
      // Add the move to the move history using the functional update form of setMoveHistory
      setMoveHistory((prevMoveHistory) => [
        ...prevMoveHistory,
        move.from + move.to,
      ]);
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
      // Check if the move is valid using chess.js move validation
      chess.move(move);
      const updatedBoard = parseFEN(chess.fen()); // Get the updated FEN
      setBoard(updatedBoard); // Update the board state
      if (findMissingPieces(updatedBoard) !== piecesTaken) {
        setPiecesTaken(findMissingPieces(updatedBoard));
        setHalfmoveClock(0);
      }
      if (chess.isCheckmate()) {
        if (playerColor[0] === activeColor) {
          setEndingMessage("Checkmate! You win!");
          handleEndGame("checkmate win");
        } else {
          setEndingMessage("Checkmate! You lose!");
          handleEndGame("checkmate loss");
        }
      } else if (chess.isStalemate()) {
        if (playerColor[0] === activeColor) {
          setEndingMessage("Stalemate! You win!");
          handleEndGame("stalemate win");
        } else {
          setEndingMessage("Stalemate! You lose!");
          handleEndGame("stalemate loss");
        }
      } else if (halfmoveClock === 50) {
        setEndingMessage("Draw! Game over.");
        handleEndGame("draw");
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

    // Reset the previously clicked square
    setPrevClickedSquare(null);
  }

  async function handleEndGame(result) {
    const user = await ChessApi.recordGame(username, result, elo, moveHistory, playerColor);
    setElo(user.elo);
    setGameOver(true);
  }

  function handlePlayAgain() {
    // Reset the game state and close the modal
    setGameOver(false);
    setMoveHistory([]);
    setPiecesTaken({});
    setErrorMessage("");
    setPrevClickedSquare(null);
    setPlayerColor(getRandomBoolean() ? "white" : "black");
    setBoard(parseFEN(startingFEN));
  }

  // Effect to trigger AI move when it's the AI's turn (activeColor changes)
  useEffect(() => {
    if (playerColor[0] !== activeColor) {
      makeAIMove();
    }
  }, [activeColor, playerColor]);

  useEffect(() => {
    // Set the initial board state with a random starting position
    setBoard(parseFEN(startingFEN));

    // Set the initial player color (either "white" or "black")
    setPlayerColor(getRandomBoolean() ? "white" : "black");
    const depth = adjustDifficulty(elo);
    setDifficulty(depth);

    // Initialize Stockfish
    const stockfish = new Worker("/stockfish/stockfish.js");

    stockfish.onmessage = (event) => {
      const message = event.data;
    };

    // Set the stockfishEngine state to the stockfish worker instance
    setStockfishEngine(stockfish);

    // Clean up the Stockfish worker on component unmount
    return () => {
      stockfish.terminate();
    };
  }, []);

  return (
    <div style={{ marginTop: "-30px" }}>
      {activeColor === playerColor[0] ? (
        <p>It's your turn!</p>
      ) : (
        <p>AI's turn!</p>
      )}
      <div className="chess-game-container">
        <div className="player-info">
          <GameInfoDisplay
            username={username}
            elo={elo}
            playerColor={playerColor}
            piecesTaken={piecesTaken}
          />
        </div>

        <div className="chessboard-container">
          <Chessboard
            board={board}
            playerColor={playerColor}
            errorMessage={errorMessage}
            prevClickedSquare={prevClickedSquare}
            handleClickedSquare={handleClickedSquare}
          />
        </div>

        <div className="ai-info">
          <GameInfoDisplay
            username="AI"
            elo={elo}
            playerColor={aiColor}
            piecesTaken={piecesTaken}
          />
        </div>
      </div>

      {gameOver && (
        <PlayAgain
          endingMessage={endingMessage}
          handlePlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export default ChessGame;
