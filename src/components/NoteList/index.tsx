import { useNotesContext } from "../../context/NotesContext";
import { useEffect, useState } from "react";
import Note from "../Note";
import type { NoteModel } from "../models/note";
import { Container, Row } from "react-bootstrap";
import "./style.css";
import apiClient from "../../utils/api-client";

type Props = {
  searchText: string;
};
function NoteList({ searchText }: Props) {
  const { setNotes, notes } = useNotesContext();
  const [filteredNotes, setFilteredNotes] = useState<NoteModel[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { data },
        } = await apiClient.get("/notes");
        setNotes(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [setNotes]);

  useEffect(() => {
    const notesList = notes.filter(
      (note) =>
        note.title.includes(searchText) || note.content.includes(searchText)
    );
    setFilteredNotes(notesList);
  }, [searchText, notes]);

  return (
    <>
      <Container className="m-0">
        <Row className="row-class">
          {filteredNotes.map((note: NoteModel) => {
            return <Note key={note._id} {...note}></Note>;
          })}
        </Row>
      </Container>
    </>
  );
}

export default NoteList;
