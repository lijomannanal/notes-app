import type { UserModel } from "./user";

export type NoteInput = {
  title: string;
  content: string;
};

export type NoteFilters = {
  [key: string]: string | number;
};

export type NoteVersion = {
  _id: string;
  noteId: string;
  version: number;
  data: NoteModel;
};

export type NoteModel = {
  _id: string;
  title: string;
  content: string;
  owner: UserModel;
  collaborators: UserModel[];
  versions?: NoteVersion[];
};
