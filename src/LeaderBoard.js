import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItemHeading, ListGroupItem } from "reactstrap";
import ChessApi from "./helpers/api";
import "./chess.css";

function LeaderBoard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    ChessApi.getLeaders()
      .then((result) => {
        setLeaders(result.users);
      })
      .catch((error) => {
        console.error("Error fetching leaders:", error);
      });
  }, []);
  return (
    <div className="chess-background" style={{ paddingTop: "25px" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "300px" }}>
          <ListGroup>
            <ListGroupItemHeading style={{ color: "white", textAlign: "center"}}>Leaderboard</ListGroupItemHeading>
            {leaders.length > 0 ? (
              leaders.map((player, index) => (
                <ListGroupItem key={player.username}>
                  <b>Rank {index + 1}:</b> <b>{player.username}</b> Elo:{" "}
                  {player.elo}
                </ListGroupItem>
              ))
            ) : (
              <ListGroupItem>No leaders available.</ListGroupItem>
            )}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
