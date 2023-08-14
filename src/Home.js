import React from "react";
import "./chess.css";
import ChessGame from "./game/ChessGame";

function Home() {
  return (
    <div className="chess-background" style={{ textAlign: "center", color: "white", paddingTop: "50px" }}>
      <ChessGame />
    </div>
  );
}

export default Home;
