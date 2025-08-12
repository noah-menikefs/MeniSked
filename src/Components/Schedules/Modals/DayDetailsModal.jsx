import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const DayDetailsModal = ({
  show,
  onHide,
  title,
  assignments,
  notes,
  adminNotesContent,
}) => {
  return (
    <div className="modal">
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title id="modalTitle">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>{assignments}</ul>
          <ul>{notes}</ul>
          {adminNotesContent}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DayDetailsModal;
