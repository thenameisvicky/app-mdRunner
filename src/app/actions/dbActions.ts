"use client";

import { DbAction } from "indexdb-action/dist/DbAction";
import { DB_ACTIONS } from "indexdb-action/dist/constants";
import { openDatabase, OBJECT_STORES } from "../helpers/dbInit.client";
import { UserPreference } from "../models/userpreference.model";
import { Folder } from "../types";
import { NoteData } from "../types";

/**
 * Database actions using IndexedDB via DbAction library
 * All operations are client-side only and use IndexedDB for persistence
 */

const USER_PREFS_ID = "user_preferences";

// Storage type that includes the id field for IndexedDB
type UserPreferenceStorage = UserPreference & { id: string };

function getDefaultPreferences(): UserPreference {
  return {
    bookMarkedCards: [],
    defaultKural: 0,
    folders: [],
    selectedFolderId: null,
  };
}

/**
 * Gets user preferences from IndexedDB
 */
export async function getUserPreferences(): Promise<UserPreference> {
  try {
    const database = await openDatabase();
    const action = new DbAction<UserPreferenceStorage, UserPreferenceStorage>(
      DB_ACTIONS.READ,
      database,
      OBJECT_STORES.USER_PREFERENCES
    );

    const results = await action.execute();
    const prefs = results?.[0];

    if (!prefs) {
      // Initialize with defaults
      const defaultPrefs = getDefaultPreferences();
      await writeUserPreferences(defaultPrefs);
      return defaultPrefs;
    }

    // Extract UserPreference from storage type (remove id)
    const { id, ...preferences } = prefs;

    // Ensure all required fields exist
    if (!Array.isArray(preferences.bookMarkedCards)) {
      preferences.bookMarkedCards = [];
    }
    if (preferences.defaultKural === undefined || preferences.defaultKural === null) {
      preferences.defaultKural = 0;
    }
    if (!Array.isArray(preferences.folders)) {
      preferences.folders = [];
    }
    if (preferences.selectedFolderId === undefined) {
      preferences.selectedFolderId = null;
    }

    return preferences;
  } catch (error) {
    console.error("Error reading user preferences from IndexedDB:", error);
    return getDefaultPreferences();
  }
}

/**
 * Writes user preferences to IndexedDB
 */
async function writeUserPreferences(preferences: UserPreference): Promise<void> {
  try {
    const database = await openDatabase();
    const action = new DbAction<UserPreferenceStorage, UserPreferenceStorage>(
      DB_ACTIONS.WRITE,
      database,
      OBJECT_STORES.USER_PREFERENCES
    );

    const storageData: UserPreferenceStorage = {
      id: USER_PREFS_ID,
      ...preferences,
    };

    await action.setDocumentData(storageData).execute();
  } catch (error) {
    console.error("Error writing user preferences to IndexedDB:", error);
    throw error;
  }
}

/**
 * Updates the selected folder ID
 */
export async function updateSelectedFolder(
  folderId: string | null
): Promise<void> {
  try {
    const prefs = await getUserPreferences();
    prefs.selectedFolderId = folderId;
    await writeUserPreferences(prefs);
  } catch (error) {
    console.error("Error updating selected folder:", error);
    throw error;
  }
}

/**
 * Adds a new folder
 */
export async function addFolder(folder: Folder): Promise<void> {
  try {
    const prefs = await getUserPreferences();
    prefs.folders = [...(prefs.folders || []), folder];
    if (!prefs.selectedFolderId) {
      prefs.selectedFolderId = folder.id;
    }
    await writeUserPreferences(prefs);
  } catch (error) {
    console.error("Error adding folder:", error);
    throw error;
  }
}

/**
 * Toggles bookmark status for a note
 */
export async function toggleBookmark(
  slug: string,
  isBookmarked: boolean
): Promise<void> {
  try {
    const prefs = await getUserPreferences();

    if (isBookmarked) {
      if (!prefs.bookMarkedCards.includes(slug)) {
        prefs.bookMarkedCards.push(slug);
      }
    } else {
      prefs.bookMarkedCards = prefs.bookMarkedCards.filter(
        (s: string) => s !== slug
      );
    }

    await writeUserPreferences(prefs);
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw error;
  }
}

/**
 * Updates the default Kural
 */
export async function updateDefaultKural(
  kuralIndex: number | null
): Promise<void> {
  try {
    const prefs = await getUserPreferences();
    prefs.defaultKural = kuralIndex ?? 0;
    await writeUserPreferences(prefs);
  } catch (error) {
    console.error("Error updating default Kural:", error);
    throw error;
  }
}

/**
 * Gets all notes from IndexedDB
 */
export async function getAllNotesFromIndexedDB(): Promise<
  Array<{ slug: string; data: NoteData }>
> {
  try {
    const database = await openDatabase();
    const action = new DbAction<
      { slug: string; data: NoteData },
      { slug: string; data: NoteData }
    >(DB_ACTIONS.READ, database, OBJECT_STORES.NOTES);

    const results = await action.execute();
    return results || [];
  } catch (error) {
    console.error("Error reading notes from IndexedDB:", error);
    return [];
  }
}

/**
 * Creates a note in IndexedDB
 */
export async function createNoteInIndexedDB(
  title: string
): Promise<{ success: boolean; error?: string; slug?: string }> {
  try {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Check if note already exists
    const database = await openDatabase();
    const readAction = new DbAction<
      { slug: string; data: NoteData },
      { slug: string; data: NoteData }
    >(DB_ACTIONS.READ, database, OBJECT_STORES.NOTES);

    const existingNotes = await readAction.execute();
    const exists = Array.isArray(existingNotes) && existingNotes.some((n) => n.slug === slug);

    if (exists) {
      return { success: false, error: "Note with this title already exists" };
    }

    // Create new note
    const createdDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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

