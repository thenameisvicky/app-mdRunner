"use server";

import {
  readPreferences,
  writePreferences,
} from "@/app/helpers/userPreference.server";
import { UserPreference } from "@/app/models/userpreference.model";
import { DB_ACTIONS } from "@/database/constants";
import path from "path";
import fs from "fs";

export async function getUserPreferences(): Promise<UserPreference> {
  return readPreferences();
}

export async function updateUserPreferences(
  preferences: Partial<UserPreference>
): Promise<UserPreference> {
  const current = readPreferences();
  const updated: UserPreference = {
    ...current,
    ...preferences,
  };
  writePreferences(updated);
  return updated;
}

export async function toggleBookmark(
  slug: string,
  bookmarked: boolean
): Promise<UserPreference> {
  const current = readPreferences();
  let bookMarkedCards = [...(current.bookMarkedCards || [])];

  if (bookmarked) {
    if (!bookMarkedCards.includes(slug)) {
      bookMarkedCards.push(slug);
    }
  } else {
    bookMarkedCards = bookMarkedCards.filter((s) => s !== slug);
  }

  const updated: UserPreference = {
    ...current,
    bookMarkedCards,
  };
  writePreferences(updated);
  return updated;
}

export async function updateSelectedFolder(
  folderId: string | null
): Promise<UserPreference> {
  const current = readPreferences();
  const updated: UserPreference = {
    ...current,
    selectedFolderId: folderId,
  };
  writePreferences(updated);
  return updated;
}

export async function updateDefaultKural(
  kural: number | null
): Promise<UserPreference> {
  const current = readPreferences();
  const updated: UserPreference = {
    ...current,
    defaultKural: kural ?? 0,
  };
  writePreferences(updated);
  return updated;
}

export async function addFolder(folder: {
  id: string;
  name: string;
  noteIds: string[];
}): Promise<UserPreference> {
  const current = readPreferences();
  const folders = [...(current.folders || []), folder];
  const selectedId = current.selectedFolderId || folder.id;

  const updated: UserPreference = {
    ...current,
    folders,
    selectedFolderId: selectedId,
  };
  writePreferences(updated);
  return updated;
}


//Todo: Implement Singleton Pattern for DbAction class
export class DbAction {
  private action: string;
  private fileName: string;
  private upsert?: string;
  private projection?: string[];
  private databasePath?: string = path.join(process.cwd(), "src", "database");

  constructor(action: string, fileName: string) {
    this.action = action;
    this.fileName = fileName;
  }

  private read() {
  }

  /**
   * @param action - The database action to perform
   * @result - The outcome of the database action
   */
  public async execute() {
    switch (this.action) {
      case DB_ACTIONS.READ: {
      }

      case DB_ACTIONS.WRITE: {
      }

      case DB_ACTIONS.UPDATE: {
      }

      case DB_ACTIONS.DELETE: {
      }
    }
  }
}
