import React, { useState, useEffect, useContext } from "react";
import { translateAlgebraicNotation } from "../helpers/chess.js";
import { AuthContext } from "../helpers/AuthContext";
import Chessboard from "./Chessboard";
import ChessApi from "../helpers/api.js";
import { useParams } from "react-router-dom";
import { Button } from "reactstrap";
import "../chess.css";
import { FaStepForward, FaStepBackward } from "react-icons/fa";
import { debounce } from 'lodash';

function ReplayMatch() {
  // Initial FEN strings representing the starting position for white and black
  // FEN stands for Forsyth-Edwards Notation. It is a standard notation used to describe the current position of a chessboard.
  const startingFEN =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0";

  // State to keep track of the chessboard and piece positions
  const [board, setBoard] = useState([]);

  // Game states
  const [playerColor, setPlayerColor] = useState("white");
  const [moveHistory, setMoveHistory] = useState([]);
  const { username } = useContext(AuthContext);
  const { matchId } = useParams();
  const [turn, setTurn] = useState(0);
  const [boardHistory, setBoardHistory] = useState([]);

  // added to fix error where user clicks faster than state update.
  const debouncedClickForward = debounce(handleClickForward, 300);
  const debouncedClickBackward = debounce(handleClickBack, 300);

  function parseFEN(fen) {
    const [position] = fen.split(" ");
    const rows = position.split("/");

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

  useEffect(() => {
    if (!username) return;
    // Set the initial board state with a random starting position
    setBoard(parseFEN(startingFEN));
    setBoardHistory([parseFEN(startingFEN)]);
    const getReplays = async () => {
      try {
        const { match } = await ChessApi.replayGame(matchId);
        setPlayerColor(match.user_color);
        setMoveHistory(match.moves);
      } catch (error) {
        console.error("Error fetching replay data:", error);
      }
    };

    getReplays();
  }, []);

  function handleClickForward() {
    if (turn >= moveHistory.length) return;

    const move = moveHistory[turn].notation;
    if (move.length !== 4) return;

    const fromSquare = move.substring(0, 2);
    const toSquare = move.substring(2, 4);

    movePiece(fromSquare, toSquare);
    setTurn(turn + 1);
  }

  function movePiece(fromSquare, toSquare) {
    const firstSquare = translateAlgebraicNotation(fromSquare);
    const secondSquare = translateAlgebraicNotation(toSquare);
  
    const piece = board[firstSquare.row][firstSquare.col];
    const updatedBoard = board.map(row => [...row]);
  
    updatedBoard[firstSquare.row][firstSquare.col] = "1";
    updatedBoard[secondSquare.row][secondSquare.col] = piece;
  
    setBoard(updatedBoard);
    setBoardHistory([...boardHistory, updatedBoard]);
  }

  function handleClickBack() {
    if (turn === 0) return;
    if (boardHistory.length < 1) return;
    const previousTurn = turn - 1;
    const previousBoard = boardHistory[previousTurn];
    setBoard(previousBoard);
    setTurn(previousTurn);
  
    setBoardHistory(boardHistory.slice(0, -1));
  }

  return (
    <div
      className="chess-background"
      style={{ textAlign: "center", color: "white", paddingTop: "50px" }}
    >
      {console.log(boardHistory)}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginRight: "100px",
            marginTop: "150px",
          }}
        >
          <Button
            color="primary"
            onClick={debouncedClickForward}
            style={{ marginBottom: "30px" }}
          >
            Next Move <FaStepForward />
          </Button>
          <Button color="primary" onClick={debouncedClickBackward}>
            Prev Move <FaStepBackward />
          </Button>
        </div>
        <div className="chess-game-container">
          <Chessboard
            board={board}
            playerColor={playerColor}
          />
        </div>
      </div>
    </div>
  );
}

export default ReplayMatch;
