import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

function Delete({username, handleDelete}) {
  const [modalOpen, setModalOpen] = useState(true);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete {username}?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleDelete}>
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

export default Delete;