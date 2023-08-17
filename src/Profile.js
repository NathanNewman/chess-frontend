import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./helpers/AuthContext";
import ChessApi from "./helpers/api";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import "./chess.css";
import Delete from "./Delete";

function Profile() {
  const {
    setAuthenticated,
    username,
    setUsername,
    elo,
    setElo,
  } = useContext(AuthContext);
  const [record, setRecord] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for modal visibility
  const history = useHistory();

  async function handleDelete() {
    try {
      // Call the API or perform delete action here
      console.log(`Deleting user: ${username}`);
      await ChessApi.deleteUser(username);
      // Close the modal
      setShowDeleteModal(false);
      ChessApi.logout();
      setUsername("");
      setElo("");
      setAuthenticated("");
      history.push("/login");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    if (!username) return;

    const fetchWinLossRecord = async () => {
      try {
        const record = await ChessApi.getWinLoss(username);
        setRecord(record.result);
      } catch (error) {
        console.error("Error fetching win-loss record:", error);
      }
    };

    fetchWinLossRecord();
  }, [username]);
  return (
    <div
      className="chess-background"
      style={{ textAlign: "center", color: "black", paddingTop: "50px" }}
    >
      <Card style={{ maxWidth: "300px", margin: "0 auto" }}>
        <CardBody>
          <CardTitle>{username}</CardTitle>
          <CardText>Elo: {elo}</CardText>
          <CardText>Record: {record}</CardText>
          <Button color="danger" onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>
        </CardBody>
      </Card>
      {/* Render the Delete modal if showDeleteModal is true */}
      {showDeleteModal && (
        <Delete username={username} handleDelete={handleDelete} />
      )}
    </div>
  );
}

export default Profile;
