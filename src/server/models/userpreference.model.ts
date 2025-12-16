export interface Folder {
  id: string;
  name: string;
  noteIds: string[];
}

export interface UserPreference {
  bookMarkedCards: Array<string>;
  defaultKural: number;
  folders: Folder[];
  selectedFolderId: string | null;
}
