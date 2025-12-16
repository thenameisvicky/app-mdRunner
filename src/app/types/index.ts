// Shared types across the application

export type Note = {
  slug: string;
  frontmatter: Record<string, string>;
  content: string;
};

export type NoteData = {
  title: string;
  createdDate: string;
  content: string;
};

export type NotesStorage = Record<string, NoteData>;

export type Folder = {
  id: string;
  name: string;
  noteIds: string[];
};

export type UserPreferencesResponse = {
  bookMarkedCards: string[];
  defaultKural: number;
  folders: Folder[];
  selectedFolderId: string | null;
};

export type CreateNoteResponse = {
  success: boolean;
  error?: string;
  slug?: string;
};

export type ApiResponse<T = unknown> = {
  success?: boolean;
  error?: string;
  data?: T;
};

export type NotesApiResponse = {
  notes: Note[];
};

