import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { NoteModel } from "../components/models/note";

type ContextProps = {
  notes: NoteModel[];
  setNotes: Dispatch<SetStateAction<NoteModel[]>>;
  selectedNote?: NoteModel;
  setSelectedNote: Dispatch<SetStateAction<undefined | NoteModel>>;
};
const NotesContext = createContext<ContextProps | undefined>(undefined);
export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteModel>();

  return (
    <NotesContext.Provider
      value={{ notes, setNotes, selectedNote, setSelectedNote }}
    >
      {children}
    </NotesContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("Cannot get context");
  }
  return context;
};
