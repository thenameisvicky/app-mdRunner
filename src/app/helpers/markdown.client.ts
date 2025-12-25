"use client";

import { Note, NoteData } from "@/app/types";
import dayjs from "dayjs";
import { DbAction } from "indexdb-action/dist/DbAction";
import { DB_ACTIONS } from "indexdb-action/dist/constants";
import { openDatabase, OBJECT_STORES } from "./dbInit.client";

/**
 * Loads vault notes from the bundled JSON file
 */
async function loadVaultNotes(): Promise<Note[]> {
  try {
    const response = await fetch('/vault-bundle.json');
    if (!response.ok) {
      console.warn('Vault bundle not found, returning empty array');
      return [];
    }
    const notes: Note[] = await response.json();
    return notes;
  } catch (error) {
    console.error('Error loading vault notes:', error);
    return [];
  }
}

/**
 * Gets all notes from IndexedDB and merges with vault notes
 * Replaces localStorage-based getAllNotesFromLocalStorage
 */
export async function getAllNotesFromLocalStorage(): Promise<Note[]> {
  try {
    if (typeof window === "undefined") {
      return [];
    }

    // Load vault notes (static markdown files)
    const vaultNotes = await loadVaultNotes();
    
    // Load user-created notes from IndexedDB
    const database = await openDatabase();
    const action = new DbAction<
      { slug: string; data: NoteData },
      { slug: string; data: NoteData }
    >(DB_ACTIONS.READ, database, OBJECT_STORES.NOTES);

    const results = await action.execute();
    const userNotes: Note[] = Array.isArray(results) 
      ? results.map(({ slug, data }) => ({
          slug,
          frontmatter: {
            title: data.title,
            date: data.createdDate,
          },
          content: data.content,
        }))
      : [];

    // Merge vault notes with user notes (user notes take precedence if slug matches)
    const vaultSlugs = new Set(vaultNotes.map(n => n.slug));
    const uniqueUserNotes = userNotes.filter(n => !vaultSlugs.has(n.slug));
    
    return [...vaultNotes, ...uniqueUserNotes];
  } catch (error) {
    console.error("Error reading notes:", error);
    return [];
  }
}

/**
 * Creates a note in IndexedDB
 * Replaces localStorage-based createNoteInLocalStorage
 */
export async function createNoteInLocalStorage(
  title: string
): Promise<{ success: boolean; error?: string; slug?: string }> {
  try {
    if (typeof window === "undefined") {
      return { success: false, error: "Window not available" };
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const database = await openDatabase();

    // Check if note already exists
    const readAction = new DbAction<
      { slug: string; data: NoteData },
      { slug: string; data: NoteData }
    >(DB_ACTIONS.READ, database, OBJECT_STORES.NOTES);

    const existingNotes = await readAction.execute();
    const exists = existingNotes?.some((n) => n.slug === slug);

    if (exists) {
      return { success: false, error: "Note with this title already exists" };
    }

    // Create new note
    const createdDate = dayjs().format("MMMM D, YYYY");
    const noteData: NoteData = {
      title,
      createdDate,
      content: `# ${title}\n\nYour content here...`,
    };

    const writeAction = new DbAction<
      { slug: string; data: NoteData },
      { slug: string; data: NoteData }
    >(DB_ACTIONS.WRITE, database, OBJECT_STORES.NOTES);

    await writeAction
      .setDocumentData({
        slug,
        data: noteData,
      })
      .execute();

    return { success: true, slug };
  } catch (error) {
    console.error("Error creating note in IndexedDB:", error);
    return { success: false, error: "Failed to create note" };
  }
}









