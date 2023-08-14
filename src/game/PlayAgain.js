import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

function PlayAgain({endingMessage, handlePlayAgain}) {
  const [modalOpen, setModalOpen] = useState(true);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{endingMessage}</ModalHeader>
        <ModalBody>
          Do you want to play again?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handlePlayAgain}>
            Yes
          </Button>{" "}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default PlayAgain;