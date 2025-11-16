import { UserPreference } from "./models/userpreference.model";
import fs from "fs";
import path from "path";

export function readPreferences(preferencesPath: string): UserPreference {
  try {
    if (!fs.existsSync(preferencesPath)) {
      const defaultPreferences: UserPreference = {
        bookMarkedCards: [],
      };
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
    return preferences;
  } catch (error) {
    console.error("Error reading preferences:", error);
    return { bookMarkedCards: [] };
  }
}

export function writePreferences(
  preferences: UserPreference,
  preferencesPath: string
): void {
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
