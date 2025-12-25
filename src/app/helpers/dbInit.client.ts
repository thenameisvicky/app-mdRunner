"use client";

/**
 * Database initialization helper for IndexedDB
 * Creates and manages the database connection and object stores
 */

const DB_NAME = "mdRunnerDB";
const DB_VERSION = 1;

export const OBJECT_STORES = {
  USER_PREFERENCES: "user_preferences",
  BOOKMARKS: "bookmarks",
  FOLDER_GROUPS: "folder_groups",
  APP_DEFAULTS: "app_defaults",
  NOTES: "notes",
} as const;

export interface OpenDBResult {
  database: IDBDatabase;
  error?: Error;
}

/**
 * Opens the IndexedDB database and creates object stores if they don't exist
 * @returns Promise that resolves with the database instance
 */
export async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open database: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(OBJECT_STORES.USER_PREFERENCES)) {
        const prefsStore = db.createObjectStore(OBJECT_STORES.USER_PREFERENCES, {
          keyPath: "id",
        });
        prefsStore.createIndex("id", "id", { unique: true });
      }

      if (!db.objectStoreNames.contains(OBJECT_STORES.BOOKMARKS)) {
        db.createObjectStore(OBJECT_STORES.BOOKMARKS, {
          keyPath: "slug",
        });
      }

      if (!db.objectStoreNames.contains(OBJECT_STORES.FOLDER_GROUPS)) {
        const foldersStore = db.createObjectStore(OBJECT_STORES.FOLDER_GROUPS, {
          keyPath: "id",
        });
        foldersStore.createIndex("id", "id", { unique: true });
      }

      if (!db.objectStoreNames.contains(OBJECT_STORES.APP_DEFAULTS)) {
        const defaultsStore = db.createObjectStore(OBJECT_STORES.APP_DEFAULTS, {
          keyPath: "key",
        });
        defaultsStore.createIndex("key", "key", { unique: true });
      }

      if (!db.objectStoreNames.contains(OBJECT_STORES.NOTES)) {
        const notesStore = db.createObjectStore(OBJECT_STORES.NOTES, {
          keyPath: "slug",
        });
        notesStore.createIndex("slug", "slug", { unique: true });
      }
    };
  });
}

