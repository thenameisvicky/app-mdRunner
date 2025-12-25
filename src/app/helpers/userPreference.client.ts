import { UserPreference } from "@/app/models/userpreference.model";

function getDefaultPreferences(): UserPreference {
  return {
    bookMarkedCards: [],
    defaultKural: 0,
    folders: [],
    selectedFolderId: null,
  };
}

export function readPreferencesFromClient(): UserPreference {
  try {
    const stored = localStorage.getItem("userPreferences");
    if (!stored) {
      const defaultPreferences = getDefaultPreferences();
      localStorage.setItem("userPreferences", JSON.stringify(defaultPreferences));
      return defaultPreferences;
    }

    const preferences: UserPreference = JSON.parse(stored);

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
    console.error("Error reading preferences from localStorage:", error);
    return getDefaultPreferences();
  }
}

export function writePreferencesToClient(preferences: UserPreference): void {
  try {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
  } catch (error) {
    console.error("Error writing preferences to localStorage:", error);
    throw error;
  }
}











