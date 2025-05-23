import type { NoteModel } from "./note";

export enum Toastvariants {
  Success = "success",
  Danger = "danger",
  Warning = "warning",
  Info = "info",
}
export type CustomToastProps = {
  title?: string;
  message?: string;
  show?: boolean;
  variant?: Toastvariants;
  onClose?: () => void;
};

export enum SOCKET_ACTIONS {
  ADD_NOTE = "add_note",
  UPDATE_NOTE = "update_note",
  DELETE_NOTE = "delete_note",
  JOIN_NOTE = "join_note",
  LEAVE_NOTE = "leave_note",
  NOTE_USERS = "note_users",
  UPDATE_CURRENT_NOTE = "update_current_note",
}
export interface ClientToServerEvents {
  [SOCKET_ACTIONS.JOIN_NOTE]: (note_id: string) => void;
  [SOCKET_ACTIONS.LEAVE_NOTE]: (note_id: string) => void;
}
export interface ServerToClientEvents {
  [SOCKET_ACTIONS.ADD_NOTE]: (message: {
    text: string;
    data: NoteModel;
  }) => void;
  [SOCKET_ACTIONS.UPDATE_NOTE]: (message: {
    text: string;
    data: NoteModel;
  }) => void;
  [SOCKET_ACTIONS.DELETE_NOTE]: (message: {
    text: string;
    noteId: string;
  }) => void;
  [SOCKET_ACTIONS.NOTE_USERS]: (users: string[]) => void;

  [SOCKET_ACTIONS.UPDATE_CURRENT_NOTE]: (message: {
    text: string;
    data: NoteModel;
  }) => void;
}
