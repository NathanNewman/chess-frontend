import React from "react";
import { Card, CardBody, CardTitle, CardText, CardHeader } from "reactstrap";
import "./styles.css";

function GameInfoDisplay({ username, elo, playerColor, piecesTaken }) {
  const filteredPiecesTaken = [];
  Object.keys(piecesTaken).forEach((pieceType) => {
    if (playerColor === "white" && pieceType === pieceType.toLowerCase()) {
      for (let i = 0; i < piecesTaken[pieceType]; i++) {
        filteredPiecesTaken.push(pieceType);
      }
    } else if (
      playerColor === "black" &&
      pieceType === pieceType.toUpperCase()
    ) {
      for (let i = 0; i < piecesTaken[pieceType]; i++) {
        filteredPiecesTaken.push(pieceType);
      }
    }
  });
  return (
    <Card color="secondary" style={{ maxWidth: "200px", minHeight: "400px" }}>
      <CardBody>
        <CardTitle>
          {playerColor === "white" ? (
            <img src={require("./pieces/K.png")} className="chess-piece" />
          ) : (
            <img src={require("./pieces/k.png")} className="chess-piece" />
          )}{" "}
          {"  "}
          {username}
        </CardTitle>
        <CardText>Elo: {elo}</CardText>

        <CardHeader>Pieces Taken</CardHeader>
        <div className="pieces-taken">
          {filteredPiecesTaken.map((piece, index) => (
            <img
              key={index}
              src={require(`./pieces/${piece}.png`)}
              alt={`${piece} piece`}
              className="chess-piece"
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default GameInfoDisplay;
