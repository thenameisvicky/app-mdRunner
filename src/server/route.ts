import { NextRequest, NextResponse } from "next/server";
import {
  readPreferences,
  writePreferences,
} from "./helpers/userPreference.helper";

type BookmarkUpdateBody = {
  slug?: string;
  bookmarked?: boolean;
  defaultKural?: number | null;
  folders?: Array<{ id: string; name: string; noteIds: string[] }>;
  selectedFolderId?: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const filename = request.headers.get("x-file-name");
    if (!filename || !filename.trim()) {
      return NextResponse.json(
        { error: "Filename not provided" },
        { status: 400 }
      );
    }
    const preferences = readPreferences(filename);
    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const filename = request.headers.get("x-file-name");
    const body = (await request.json()) as BookmarkUpdateBody;

    if (!filename || !filename.trim()) {
      return NextResponse.json(
        { error: "Filename not provided" },
        { status: 400 }
      );
    }

    const preferences = readPreferences(filename);

    if (body.slug !== undefined && body.bookmarked !== undefined) {
      const { slug, bookmarked } = body;

      if (typeof slug !== "string") {
        return NextResponse.json(
          { error: "Invalid request: slug must be a string" },
          { status: 400 }
        );
      }

      if (typeof bookmarked !== "boolean") {
        return NextResponse.json(
          { error: "Invalid request: bookmarked must be a boolean" },
          { status: 400 }
        );
      }

      if (bookmarked) {
        if (!preferences.bookMarkedCards.includes(slug)) {
          preferences.bookMarkedCards.push(slug);
        }
      } else {
        preferences.bookMarkedCards = preferences.bookMarkedCards.filter(
          (bookmarkedSlug) => bookmarkedSlug !== slug
        );
      }
    }

    if (body.defaultKural !== undefined) {
      if (body.defaultKural !== null && typeof body.defaultKural !== "number") {
        return NextResponse.json(
          { error: "Invalid request: defaultKural must be a number or null" },
          { status: 400 }
        );
      }
      preferences.defaultKural = body.defaultKural ?? 0;
    }

    if (body.folders !== undefined) {
      if (Array.isArray(body.folders)) {
        preferences.folders = body.folders;
      }
    }

    if (body.selectedFolderId !== undefined) {
      preferences.selectedFolderId = body.selectedFolderId;
    }

    writePreferences(preferences, filename);
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
