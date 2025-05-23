import Form from "react-bootstrap/Form";
import "./style.css";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import ReactMarkdown from "react-markdown";
import useDebounce from "../../hooks/useDebounceValue";
import apiClient from "../../utils/api-client";
import { useNotesContext } from "../../context/NotesContext";
import { AxiosError } from "axios";
import { useSocket } from "../../context/SocketContext";
import { SOCKET_ACTIONS, Toastvariants } from "../models/common";
import { useLayoutContext } from "../../context/LayoutContext";

function NoteForm() {
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const debouncedMarkdown = useDebounce(markdown, 1000);
  const debouncedTitle = useDebounce(title, 1000);
  const { setSelectedNote, setNotes, selectedNote } = useNotesContext();
  const { socket, isConnected } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const intervalId = useRef(0);
  const { setToastInfo } = useLayoutContext();

  const saveNote = useCallback(
    async (noteId?: string) => {
      try {
        if (!noteId) {
          const { data } = await apiClient.post("/notes", {
            title: debouncedTitle,
            content: debouncedMarkdown,
          });
          hasInputChanged.current = 0;
          setSelectedNote(data);
        } else {
          await apiClient.put(`/notes/${noteId}`, {
            title: debouncedTitle,
            content: debouncedMarkdown,
          });
        }
      } catch (error) {
        let message = error;
        if (error instanceof AxiosError) {
          message = error.response?.data?.error;
        }
        setToastInfo({
          title: "Error",
          message: `${message}`,
          show: true,
          variant: Toastvariants.Danger,
        });
      }
    },
    [debouncedMarkdown, debouncedTitle, setSelectedNote, setToastInfo]
  );
  const startAutoSave = useCallback(() => {
    intervalId.current = setInterval(() => {
      saveNote(selectedNote?._id);
    }, 10000);
  }, [saveNote, selectedNote?._id]);

  const resetInterval = useCallback(() => {
    clearInterval(intervalId.current);
    startAutoSave();
  }, [startAutoSave]);
  useEffect(() => {
    if (isConnected) {
      socket?.on(SOCKET_ACTIONS.NOTE_USERS, (users: string[]) => {
        setOnlineUsers(users);
      });
      if (selectedNote?._id) {
        socket?.emit(SOCKET_ACTIONS.JOIN_NOTE, selectedNote._id);
      }
      socket?.on(SOCKET_ACTIONS.UPDATE_CURRENT_NOTE, ({ data }) => {
        hasInputChanged.current = 0;
        setSelectedNote(data);
        resetInterval();
      });
    }
    return () => {
      if (isConnected) {
        socket?.off(SOCKET_ACTIONS.NOTE_USERS);
        socket?.off(SOCKET_ACTIONS.UPDATE_CURRENT_NOTE);
      }
    };
  }, [
    socket,
    isConnected,
    setNotes,
    setSelectedNote,
    selectedNote?._id,
    resetInterval,
  ]);

  const hasInputChanged = useRef(0);

  useEffect(() => {
    startAutoSave();
    return () => {
      clearInterval(intervalId.current);
    };
  }, [startAutoSave]);

  useEffect(() => {
    if (hasInputChanged.current > 0 && debouncedMarkdown && debouncedTitle) {
      saveNote(selectedNote?._id);
    }
  }, [
    debouncedMarkdown,
    debouncedTitle,
    setSelectedNote,
    setNotes,
    saveNote,
    selectedNote?._id,
  ]);

  useEffect(() => {
    if (selectedNote) {
      const { title, content } = selectedNote;
      setTitle(title);
      setMarkdown(content);
    }
  }, [selectedNote]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    hasInputChanged.current = hasInputChanged.current + 1;
    const { name, value } = event.target;
    if (name === "title") {
      setTitle(value);
    } else {
      setMarkdown(value);
    }
  };
  let owner = "-";
  let collaborators = "-";
  if (selectedNote) {
    owner = selectedNote.owner.username;
    collaborators = selectedNote.collaborators
      .map((co) => co.username)
      .join(", ");
  }

  return (
    <>
      <div className="d-flex justify-content-center">
        {selectedNote?._id && (
          <span>Online Users: {onlineUsers.join(", ")}</span>
        )}
      </div>
      <Form noValidate className="mb-3">
        <Form.Group className="mb-3" controlId="title">
          <Form.Label className="text-center">Title</Form.Label>
          <Form.Control
            name="title"
            type="text"
            onChange={handleChange}
            value={title}
            placeholder="Title"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="markdown">
          <Form.Label>Markdown</Form.Label>
          <Form.Control
            name="markdown"
            onChange={handleChange}
            value={markdown}
            as="textarea"
            rows={4}
          />
        </Form.Group>
      </Form>
      <div className="preview-container">
        Preview
        <div className="preview">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
      <div className="credits">
        <div>Owner:</div>
        <div>{owner}</div>
      </div>
      <div className="credits">
        <div>Collaborators:</div>
        <div>{collaborators}</div>
      </div>
    </>
  );
}

export default NoteForm;
