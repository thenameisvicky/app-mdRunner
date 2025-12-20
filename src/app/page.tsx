"use client";

import { useState, useEffect } from "react";
import NotesGrid from "./components/NotesGrid";
import KuralHeader from "./components/KuralHeader";
import NoteModal from "./components/NoteModal";
import Button from "./common/Button";
import ToastContainer, { useToast } from "./common/ToastContainer";
import {
  Note,
  Folder,
  NotesStorage,
  CreateNoteResponse,
} from "./types";
import { isDevelopment } from "./constants";
import { readPreferencesFromClient, writePreferencesToClient } from "./helpers/userPreference.client";
import { getUserPreferences, updateSelectedFolder as updateSelectedFolderAction, addFolder as addFolderAction } from "./actions/dbActions";
import { getAllNotes as getAllNotesAction, createNote as createNoteAction } from "./actions/vaultActions";
import { getAllNotesFromLocalStorage, createNoteInLocalStorage } from "./helpers/markdown.client";

export default function Home() {
  const [allMarkDowns, setAllMarkDowns] = useState<Note[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { showToast, removeToast, toasts } = useToast();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    loadNotes();
    loadFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedFolderId) {
      const folder = folders.find((f) => f.id === selectedFolderId);
      if (folder) {
        setFilteredNotes(
          allMarkDowns.filter((note) => folder.noteIds.includes(note.slug))
        );
      } else {
        setFilteredNotes([]);
      }
    } else {
      setFilteredNotes(allMarkDowns);
    }
  }, [selectedFolderId, folders, allMarkDowns]);

  const loadNotes = async (): Promise<void> => {
    try {
      if (isDevelopment) {
        const notes = await getAllNotesAction();
        setAllMarkDowns(notes);
      } else {
        if (typeof window === "undefined") return;
        const notes = getAllNotesFromLocalStorage();
        if (notes.length === 0) {
          const defaultNote: Note = {
            slug: "Hello",
            frontmatter: {
              title: "Hello",
              date: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
            content:
              "# Hello\n\nThis is your first note. Create more notes using the 'Create Note' button.",
          };
          const notesData: NotesStorage = {
            hello: {
              title: defaultNote.frontmatter.title,
              createdDate: defaultNote.frontmatter.date,
              content: defaultNote.content,
            },
          };
          localStorage.setItem("notes", JSON.stringify(notesData));
          setAllMarkDowns([defaultNote]);
        } else {
          setAllMarkDowns(notes);
        }
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const loadFolders = async (): Promise<void> => {
    try {
      if (isDevelopment) {
        const data = await getUserPreferences();
        if (Array.isArray(data.folders)) {
          setFolders(data.folders);
          if (
            data.selectedFolderId &&
            data.folders.find((f: Folder) => f.id === data.selectedFolderId)
          ) {
            setSelectedFolderId(data.selectedFolderId);
          } else if (data.folders.length > 0) {
            setSelectedFolderId(data.folders[0].id);
            await updateSelectedFolder(data.folders[0].id);
          }
        }
      } else {
        if (typeof window === "undefined") return;
        const prefs = readPreferencesFromClient();
        if (Array.isArray(prefs.folders)) {
          setFolders(prefs.folders);
          if (
            prefs.selectedFolderId &&
            prefs.folders.find((f: Folder) => f.id === prefs.selectedFolderId)
          ) {
            setSelectedFolderId(prefs.selectedFolderId);
          } else if (prefs.folders.length > 0) {
            setSelectedFolderId(prefs.folders[0].id);
            await updateSelectedFolder(prefs.folders[0].id);
          }
        }
      }
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const updateSelectedFolder = async (
    folderId: string | null
  ): Promise<void> => {
    setSelectedFolderId(folderId);

    try {
      if (isDevelopment) {
        await updateSelectedFolderAction(folderId);
      } else {
        if (typeof window === "undefined") return;
        const prefs = readPreferencesFromClient();
        prefs.selectedFolderId = folderId;
        writePreferencesToClient(prefs);
      }
    } catch (error) {
      console.error("Error updating selected folder:", error);
    }
  };

  const handleCreateNote = async (
    title: string
  ): Promise<CreateNoteResponse> => {
    try {
      if (isDevelopment) {
        const result = await createNoteAction(title);
        if (result.success) {
          showToast("success", "Note created successfully", 5000);
          loadNotes();
          return { success: true };
        } else {
          if (result.error?.includes("already exists")) {
            showToast("warning", "Note with this title already exists", 5000);
          } else {
            showToast("error", result.error || "Failed to create note", 5000);
          }
          return { success: false, error: result.error };
        }
      } else {
        if (typeof window === "undefined") {
          return { success: false, error: "Window not available" };
        }
        const result = createNoteInLocalStorage(title);
        if (result.success) {
          showToast("success", "Note created successfully", 5000);
          loadNotes();
          return { success: true };
        } else {
          if (result.error?.includes("already exists")) {
            showToast("warning", "Note with this title already exists", 5000);
          } else {
            showToast("error", result.error || "Failed to create note", 5000);
          }
          return { success: false, error: result.error };
        }
      }
    } catch (error) {
      console.error("Error creating note:", error);
      showToast("error", "Failed to create note", 5000);
      return { success: false, error: "Failed to create note" };
    }
  };

  const handleCreateFolder = async (
    name: string,
    noteIds: string[]
  ): Promise<void> => {
    const newFolder: Folder = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      noteIds,
    };

    try {
      if (isDevelopment) {
        await addFolderAction(newFolder);
        await loadFolders();
        setIsFolderModalOpen(false);
        showToast("success", "Folder created successfully", 5000);
      } else {
        if (typeof window === "undefined") return;
        const prefs = readPreferencesFromClient();
        prefs.folders = [...(prefs.folders || []), newFolder];
        if (!prefs.selectedFolderId) {
          prefs.selectedFolderId = newFolder.id;
          setSelectedFolderId(newFolder.id);
        }
        writePreferencesToClient(prefs);
        setFolders(prefs.folders);
        setIsFolderModalOpen(false);
        showToast("success", "Folder created successfully", 5000);
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create folder";
      showToast("error", errorMessage, 5000);
    }
  };

  return (
    <div className="min-h-screen notion-bg bg-[#f7f6f3]">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="border-b bg-white border-[#e9e9e7] p-6">
        <h1 className="text-2xl font-bold text-[#37352f]">MD Runner</h1>
        <KuralHeader />
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <Button
            variant="default"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Note
          </Button>
          <Button
            variant="default"
            onClick={() => setIsFolderModalOpen(true)}
            className="px-4 py-2 flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            Add Folder
          </Button>
          {folders.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => updateSelectedFolder(null)}
                className={`px-3 py-1.5 text-sm rounded border ${
                  selectedFolderId === null
                    ? "bg-[#37352f] text-white border-[#37352f]"
                    : "bg-white text-[#37352f] border-[#e9e9e7] hover:bg-[#f7f6f3]"
                }`}
              >
                All Notes
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => updateSelectedFolder(folder.id)}
                  className={`px-3 py-1.5 text-sm rounded border ${
                    selectedFolderId === folder.id
                      ? "bg-[#37352f] text-white border-[#37352f]"
                      : "bg-white text-[#37352f] border-[#e9e9e7] hover:bg-[#f7f6f3]"
                  }`}
                >
                  {folder.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-[#787774]">
              {selectedFolderId
                ? "No notes in this folder."
                : "No notes found."}
            </p>
          </div>
        ) : (
          <NotesGrid notes={filteredNotes} />
        )}
      </div>

      <NoteModal
        note={null}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onCreateNote={handleCreateNote}
      />

      {isFolderModalOpen && (
        <FolderModal
          isOpen={isFolderModalOpen}
          onClose={() => setIsFolderModalOpen(false)}
          notes={allMarkDowns}
          folders={folders}
          onCreateFolder={handleCreateFolder}
        />
      )}
    </div>
  );
}

type FolderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  folders: Folder[];
  onCreateFolder: (name: string, noteIds: string[]) => void;
};

function FolderModal({
  isOpen,
  onClose,
  notes,
  folders,
  onCreateFolder,
}: FolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (isOpen) {
      setFolderName("");
      setSelectedNoteIds(new Set());
    }
  }, [isOpen]);

  const handleToggleNote = (noteId: string) => {
    const newSet = new Set(selectedNoteIds);
    if (newSet.has(noteId)) {
      newSet.delete(noteId);
    } else {
      newSet.add(noteId);
    }
    setSelectedNoteIds(newSet);
  };

  const handleCreate = () => {
    if (!folderName.trim()) return;
    onCreateFolder(folderName.trim(), Array.from(selectedNoteIds));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[rgba(15,15,15,0.1)] backdrop-blur-[2px] z-[9998]"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden bg-white rounded-lg shadow-[0_4px_32px_rgba(15,15,15,0.1)] border border-[#e9e9e7] z-[9999]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e9e9e7] p-6">
          <h2 className="text-xl font-bold text-[#37352f]">Create Folder</h2>
          <Button
            variant="icon"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-gray-100 text-[#37352f]"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 200px)" }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#37352f] mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name..."
              className="w-full px-3 py-2 border border-[#e9e9e7] rounded-md text-[#37352f] focus:outline-none focus:ring-2 focus:ring-[#37352f]"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#37352f] mb-2">
              Select Notes to Include
            </label>
            <div className="max-h-64 overflow-y-auto border border-[#e9e9e7] rounded-md p-2">
              {notes.length === 0 ? (
                <p className="text-sm text-[#787774] p-2">No notes available</p>
              ) : (
                notes.map((note) => {
                  // Find which folder(s) this note belongs to
                  const noteFolders = folders.filter((f) =>
                    f.noteIds.includes(note.slug)
                  );
                  const folderNames = noteFolders.map((f) => f.name).join(", ");

                  return (
                    <label
                      key={note.slug}
                      className="flex items-center gap-2 p-2 hover:bg-[#f7f6f3] rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedNoteIds.has(note.slug)}
                        onChange={() => handleToggleNote(note.slug)}
                        className="w-4 h-4 text-[#37352f] border-[#e9e9e7] rounded focus:ring-[#37352f]"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm text-[#37352f]">
                          {note.frontmatter.title || note.slug}
                        </span>
                        {folderNames && (
                          <span className="text-xs text-[#787774] ml-2">
                            ({folderNames})
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-[#e9e9e7] px-6 py-4 bg-[#f7f6f3]">
          <Button
            variant="text"
            onClick={onClose}
            className="px-3 py-1.5 text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleCreate}
            disabled={!folderName.trim()}
            className="px-3 py-1.5 text-sm"
          >
            Create Folder
          </Button>
        </div>
      </div>
    </div>
  );
}
