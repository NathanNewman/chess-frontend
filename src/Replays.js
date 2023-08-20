import React, { useState, useEffect, useContext } from "react";
import { ListGroup, ListGroupItemHeading, ListGroupItem } from "reactstrap";
import ChessApi from "./helpers/api";
import { AuthContext } from "./helpers/AuthContext";
import "./chess.css";
import { formatDate } from "./helpers/dateTime";
import { Link } from "react-router-dom";

function Replays() {
  const { username } = useContext(AuthContext);
  const [replays, setReplays] = useState([]);
  useEffect(() => {
    if (!username) return;
    const getReplays = async () => {
      try {
        const data = await ChessApi.getMatches(username);
        setReplays(data.matches);
      } catch (error) {
        console.error("Error fetching replay data:", error);
      }
    };

    getReplays();
  }, [username]);
  return (
    <div
      className="chess-background"
      style={{ textAlign: "center", paddingTop: "50px" }}
    >
      {console.log(replays)}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "500px" }}>
          <ListGroup>
            <ListGroupItemHeading
              style={{ color: "white", textAlign: "center" }}
            >
              Replay List
            </ListGroupItemHeading>
            {replays.length > 0 ? (
              replays.map((replay, index) => (
                <Link to={`/replays/${replay.id}`} key={replay.id} className="replay-link">
                  <ListGroupItem className="replay-list-item">
                    <div className="replay-info">
                      {replay.user_color === "white" ? (
                        <img
                          src={require(`./game/pieces/K.png`)}
                          alt={replay.user_color}
                          className="chess-piece"
                        />
                      ) : (
                        <img
                          src={require(`./game/pieces/k.png`)}
                          alt={replay.user_color}
                          className="chess-piece"
                        />
                      )}
                      <b>Replay {index + 1}:</b> Match ID: {replay.id}{" "}
                      <span className="replay-result">
                        Result: {replay.result}
                      </span>
                    </div>
                    <div>{formatDate(replay.created_at)}</div>
                  </ListGroupItem>
                </Link>
              ))
            ) : (
              <ListGroupItem>No replays available.</ListGroupItem>
            )}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}

export default Replays;
