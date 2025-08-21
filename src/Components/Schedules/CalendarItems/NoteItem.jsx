import React from "react";
import Button from "react-bootstrap/Button";

const NoteItem = ({
  note,
  index,
  type,
  isAdmin = false,
  onEditNote = null,
  onDeleteNote = null,
}) => {
  // Determine the appropriate ID based on note type
  const getNoteId = () => {
    switch (type) {
      case "vn":
        return "note";
      case "in":
        return "iNote";
      case "nn":
        return "numNote";
      default:
        return "note";
    }
  };

  if (isAdmin && onEditNote && onDeleteNote) {
    return (
      <li key={`${type}-${index}`} className="note" id={getNoteId()}>
        {note.msg}
        <Button
          key={`${type}-${index}-e`}
          onClick={() => onEditNote(note.id, note.msg)}
          className="edit butn"
          size="sm"
          variant="secondary"
        >
          Edit
        </Button>
        <Button
          key={`${type}-${index}-d`}
          onClick={() => onDeleteNote(note.id)}
          className="delete butn"
          size="sm"
          variant="danger"
        >
          Delete
        </Button>
      </li>
    );
  }

  return (
    <li key={`${type}-${index}`} className="note" id={getNoteId()}>
      {note.msg}
    </li>
  );
};

export default NoteItem;
