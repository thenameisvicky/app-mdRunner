import { UserPreference } from "@/server/models/userpreference.model";
import fs from "fs";
import path from "path";

const serverPath = path.join(process.cwd(), "src", "server");

export function readPreferences(filename: string = "userPreferences"): UserPreference {
  const preferencesPath = path.join(serverPath, "database", `${filename}.json`);
  try {
    if (!fs.existsSync(preferencesPath)) {
      const defaultPreferences: UserPreference = {
        bookMarkedCards: [],
        defaultKural: 0,
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
    if (preferences.defaultKural === undefined) {
      preferences.defaultKural = 0;
    }
    return preferences;
  } catch (error) {
    console.error("Error reading preferences:", error);
    return { bookMarkedCards: [], defaultKural: 0 };
  }
}

export function writePreferences(preferences: UserPreference, filename: string = "userPreferences"): void {
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
}
