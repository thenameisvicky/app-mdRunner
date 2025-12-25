"use client";

import { UserPreference } from "@/app/models/userpreference.model";
import { DbAction } from "indexdb-action/dist/DbAction";
import { DB_ACTIONS } from "indexdb-action/dist/constants";
import { openDatabase, OBJECT_STORES } from "./dbInit.client";

function getDefaultPreferences(): UserPreference {
  return {
    bookMarkedCards: [],
    defaultKural: 0,
    folders: [],
    selectedFolderId: null,
  };
}

const USER_PREFS_ID = "user_preferences";

// Storage type that includes the id field for IndexedDB
type UserPreferenceStorage = UserPreference & { id: string };

/**
 * Reads user preferences from IndexedDB
 * Replaces localStorage-based readPreferencesFromClient
 */
export async function readPreferencesFromClient(): Promise<UserPreference> {
  try {
    if (typeof window === "undefined") {
      return getDefaultPreferences();
    }

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
      await writePreferencesToClient(defaultPrefs);
      return defaultPrefs;
    }

    // Remove the id field and ensure all required fields exist
    const { id, ...preferences } = prefs;
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
    console.error("Error reading preferences from IndexedDB:", error);
    return getDefaultPreferences();
  }
}

/**
 * Writes user preferences to IndexedDB
 * Replaces localStorage-based writePreferencesToClient
 */
export async function writePreferencesToClient(
  preferences: UserPreference
): Promise<void> {
  try {
    if (typeof window === "undefined") {
      throw new Error("Window not available");
    }

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
    console.error("Error writing preferences to IndexedDB:", error);
    throw error;
  }
}











