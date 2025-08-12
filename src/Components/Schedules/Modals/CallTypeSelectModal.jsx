import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const CallTypeSelectModal = ({ show, onHide, options, onSubmit }) => {
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!show) {
      setSelectedId(null);
    }
  }, [show]);

  const onChange = (event) => {
    const value = event?.target?.value;
    setSelectedId(value ? Number(value) : null);
  };

  return (
    <div className="modal">
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title id="modalTitle">Select Call Type</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group onChange={onChange} controlId="formBasicRadio">
              {options.map((opt) => (
                <Form.Check
                  required
                  key={opt.id}
                  name="callType"
                  type="radio"
                  id={`call-${opt.id}`}
                  value={opt.id}
                  label={opt.label}
                  checked={selectedId === Number(opt.id)}
                  onChange={onChange}
                />
              ))}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onHide} variant="secondary">
              Close
            </Button>
            <Button
              onClick={() => selectedId != null && onSubmit(selectedId)}
              variant="primary"
              disabled={selectedId == null}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CallTypeSelectModal;
