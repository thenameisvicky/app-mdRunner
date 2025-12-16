import { UserPreference } from "@/server/models/userpreference.model";
import fs from "fs";
import path from "path";

const serverPath = path.join(process.cwd(), "src", "server");
// Check NODE_ENV - in Next.js, this should be set by the build process
// For server-side code, we check both process.env.NODE_ENV and if it's undefined, assume development
const isDevelopment = 
  process.env.NODE_ENV === "development" || 
  (process.env.NODE_ENV === undefined && !process.env.VERCEL);

function getDefaultPreferences(): UserPreference {
  return {
    bookMarkedCards: [],
    defaultKural: 0,
    folders: [],
    selectedFolderId: null,
  };
}

export function readPreferences(filename: string = "userPreferences"): UserPreference {
  if (isDevelopment) {
    const preferencesPath = path.join(serverPath, "database", `${filename}.json`);
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

      if (!Array.isArray(preferences.bookMarkedCards)) {
        preferences.bookMarkedCards = [];
      }
      if (preferences.defaultKural === undefined) {
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
  } else {
    // Production: read from localStorage
    if (typeof window === "undefined") {
      return getDefaultPreferences();
    }

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
      if (preferences.defaultKural === undefined) {
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
}

export function writePreferences(preferences: UserPreference, filename: string = "userPreferences"): void {
  if (isDevelopment) {
    const preferencesPath = path.join(serverPath, "database", `${filename}.json`);
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
  } else {
    // Production: write to localStorage
    if (typeof window === "undefined") {
      throw new Error("Window not available");
    }

    try {
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
    } catch (error) {
      console.error("Error writing preferences to localStorage:", error);
      throw error;
    }
  }
}
