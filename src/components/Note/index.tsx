import Card from "react-bootstrap/Card";
import type { NoteModel, NoteVersion } from "../models/note";
import { Pencil, ClockHistory, Trash } from "react-bootstrap-icons";
import "./style.css";
import { useNotesContext } from "../../context/NotesContext";
import CustomModal from "../CustomModal";
import NoteForm from "../NoteForm";
import { useState } from "react";
import DeleteModal from "../DeleteModal";
import apiClient from "../../utils/api-client";
import { AxiosError } from "axios";
import { useSocket } from "../../context/SocketContext";
import { SOCKET_ACTIONS, Toastvariants } from "../models/common";
import NoteHistory from "../NoteHistoy";
import { useLayoutContext } from "../../context/LayoutContext";
import ReactMarkdown from "react-markdown";

function Note(note: NoteModel) {
  const { setSelectedNote } = useNotesContext();
  const { title, content, _id: noteId } = note;
  const [openForm, setOpenForm] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { socket, isConnected } = useSocket();
  const { setToastInfo } = useLayoutContext();

  const handleFormClose = () => {
    setOpenForm(false);
    if (isConnected) {
      if (noteId) {
        socket?.emit(SOCKET_ACTIONS.LEAVE_NOTE, noteId);
      }
    }
  };

  const openEditForm = (note: NoteModel) => {
    setOpenForm(true);
    setSelectedNote(note);
  };

  const deleteNote = async () => {
    try {
      await apiClient.delete(`/notes/${noteId}`);
      setOpenDeleteModal(false);
    } catch (error) {
      let message = error;
      if (error instanceof AxiosError) {
        message = error.response?.data?.error;
      }
      setToastInfo({
        title: "Error",
        message: `Note delete failed! ${message}`,
        show: true,
        variant: Toastvariants.Danger,
      });
    }
  };

  return (
    <>
      <Card border="secondary" style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            <ReactMarkdown>{content}</ReactMarkdown>
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <div className="actions">
            <button title="Edit Note" onClick={() => openEditForm(note)}>
              <Pencil />
            </button>
            <button title="View History" onClick={() => setOpenHistory(true)}>
              <ClockHistory />
            </button>
            <button
              title="Delete Note"
              onClick={() => setOpenDeleteModal(true)}
            >
              <Trash />
            </button>
          </div>
        </Card.Footer>
      </Card>
      <CustomModal
        handleClose={handleFormClose}
        show={openForm}
        title={`Edit Note`}
      >
        <NoteForm />
      </CustomModal>

      <DeleteModal
        handleSubmit={deleteNote}
        handleClose={() => setOpenDeleteModal(false)}
        show={openDeleteModal}
        title={`Delete Note`}
      >
        Are you sure you want to delete the note?
      </DeleteModal>
      <NoteHistory
        show={openHistory}
        versions={note.versions as NoteVersion[]}
        handleClose={() => setOpenHistory(false)}
      />
    </>
  );
}

export default Note;
