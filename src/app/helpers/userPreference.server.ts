import "server-only";

import { UserPreference } from "@/app/models/userpreference.model";
import fs from "fs";
import path from "path";

const databasePath = path.join(process.cwd(), "src", "database");

function getDefaultPreferences(): UserPreference {
  return {
    bookMarkedCards: [],
    defaultKural: 0,
    folders: [],
    selectedFolderId: null,
  };
}

export function readPreferences(filename: string = "userPreferences"): UserPreference {
  const preferencesPath = path.join(databasePath, `${filename}.json`);
  try {
    if (!fs.existsSync(preferencesPath)) {
      const defaultPreferences = getDefaultPreferences();
      fs.writeFileSync(
        preferencesPath,
        JSON.stringify(defaultPreferences, null, 2)
      );
      return defaultPreferences;
    }

    const fileContents = fs.readFileSync(preferencesPath, "utf8");
    const preferences: UserPreference = JSON.parse(fileContents);

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
    console.error("Error reading preferences:", error);
    return getDefaultPreferences();
  }
}

export function writePreferences(preferences: UserPreference, filename: string = "userPreferences"): void {
  const preferencesPath = path.join(databasePath, `${filename}.json`);
  try {
    const dir = path.dirname(preferencesPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      preferencesPath,
      JSON.stringify(preferences, null, 2),
      "utf8"
    );
  } catch (error) {
    console.error("Error writing preferences:", error);
    throw error;
  }
}

