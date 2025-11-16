import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readPreferences, writePreferences } from "../utils";

const preferencesPath = path.join(
  process.cwd(),
  "database",
  "userPreferences.json"
);

export async function GET() {
  try {
    const preferences = readPreferences(preferencesPath);
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
    const body: { slug: string; bookmarked: boolean } = await request.json();
    const { slug, bookmarked } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Invalid request: slug is required" },
        { status: 400 }
      );
    }

    if (typeof bookmarked !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request: bookmarked must be a boolean" },
        { status: 400 }
      );
    }

    const preferences = readPreferences(preferencesPath);
    if (bookmarked) {
      if (!preferences.bookMarkedCards.includes(slug)) {
        preferences.bookMarkedCards.push(slug);
      }
    } else {
      preferences.bookMarkedCards = preferences.bookMarkedCards.filter(
        (bookmarkedSlug) => bookmarkedSlug !== slug
      );
    }

    writePreferences(preferences, preferencesPath);
    return NextResponse.json({
      success: true,
      bookMarkedCards: preferences.bookMarkedCards,
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
