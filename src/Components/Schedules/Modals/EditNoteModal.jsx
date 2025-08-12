import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const EditNoteModal = ({ show, onHide, value, onChange, onSubmit }) => {
  return (
    <div className="modal">
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title id="modalTitle">Edit Note</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group id="note">
              <Form.Control
                required
                value={value}
                onChange={onChange}
                type="text"
                placeholder="Note"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
            <Button onClick={onSubmit} variant="primary">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default EditNoteModal;
