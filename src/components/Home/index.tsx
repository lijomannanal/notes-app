import { useEffect, useState } from "react";
import { useNotesContext } from "../../context/NotesContext";
import NoteList from "../NoteList";
import NoteSearch from "../NoteSearch";
import { Button } from "react-bootstrap";
import NoteForm from "../NoteForm";
import CustomModal from "../CustomModal";
import { useSocket } from "../../context/SocketContext";
import { SOCKET_ACTIONS, Toastvariants } from "../models/common";
import type { NoteModel } from "../models/note";
import { useLayoutContext } from "../../context/LayoutContext";

const Home = () => {
  const [searchText, setSearchText] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const { setSelectedNote, selectedNote, setNotes } = useNotesContext();
  const { setToastInfo } = useLayoutContext();
  const { socket, isConnected } = useSocket();

  const openNewNote = () => {
    setSelectedNote(undefined);
    setOpenForm(true);
  };
  const handleFormClose = () => {
    setOpenForm(false);
    if (isConnected) {
      if (selectedNote?._id) {
        socket?.emit(SOCKET_ACTIONS.LEAVE_NOTE, selectedNote._id);
      }
    }
  };

  useEffect(() => {
    if (isConnected) {
      socket?.on(SOCKET_ACTIONS.DELETE_NOTE, ({ text, noteId }) => {
        setNotes((notes) => {
          return notes.filter((note) => note._id !== noteId);
        });
        setToastInfo({
          title: "Note deleted",
          message: text,
          show: true,
          variant: Toastvariants.Info,
        });
      });
      socket?.on(SOCKET_ACTIONS.ADD_NOTE, ({ text, data }) => {
        setNotes((notes) => [...notes, data] as NoteModel[]);
        setToastInfo({
          title: "New Note",
          message: text,
          show: true,
          variant: Toastvariants.Info,
        });
      });
      socket?.on(SOCKET_ACTIONS.UPDATE_NOTE, ({ data }) => {
        setNotes((notes) => {
          return notes.map((n) => {
            return n._id === data._id ? data : n;
          });
        });
      });
    }
    return () => {
      if (isConnected) {
        socket?.off(SOCKET_ACTIONS.DELETE_NOTE);
        socket?.off(SOCKET_ACTIONS.ADD_NOTE);
        socket?.off(SOCKET_ACTIONS.UPDATE_NOTE);
      }
    };
  }, [socket, isConnected, setNotes, setToastInfo]);

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button onClick={openNewNote}>Add Note</Button>
      </div>
      <NoteSearch text={searchText} onSearch={setSearchText} />
      <NoteList searchText={searchText} />
      <CustomModal
        handleClose={handleFormClose}
        show={openForm}
        title={selectedNote ? `Edit Note` : "Add Note"}
      >
        <NoteForm />
      </CustomModal>
    </>
  );
};

export default Home;
