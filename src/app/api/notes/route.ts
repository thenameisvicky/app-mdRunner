import { NextRequest, NextResponse } from "next/server";
import { getAllNotes, createNote } from "@/server/helpers/markdown.helper";
import { NotesApiResponse, CreateNoteResponse } from "@/app/types";

export const dynamic = "force-static";
export const revalidate = false;

type CreateNoteRequestBody = {
  title: string;
};

export async function GET(): Promise<NextResponse<NotesApiResponse | { error: string }>> {
  try {
    const notes = getAllNotes();
    return NextResponse.json({ notes } as NotesApiResponse);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<CreateNoteResponse | { error: string }>> {
  try {
    const body = (await request.json()) as CreateNoteRequestBody;
    const { title } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const result = createNote(title);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

