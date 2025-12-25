import { Note, NoteData } from "@/app/types";
import dayjs from "dayjs";

export function getAllNotesFromLocalStorage(): Note[] {    
  try {
    const stored = localStorage.getItem("notes");
    if (!stored) return [];
    
    const notesData: Record<string, NoteData> = JSON.parse(stored);
    return Object.entries(notesData).map(([slug, data]) => ({
      slug,
      frontmatter: {
        title: data.title,
        date: data.createdDate,
      },
      content: data.content,
    }));
  } catch (error) {
    console.error("Error reading notes from localStorage:", error);
    return [];
  }
}

export function createNoteInLocalStorage(title: string): { success: boolean; error?: string; slug?: string } {
  try {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const stored = localStorage.getItem("notes");
    const notesData: Record<string, NoteData> = stored ? JSON.parse(stored) : {};

    if (notesData[slug]) {
      return { success: false, error: "Note with this title already exists" };
    }

    const createdDate = dayjs().format("MMMM D, YYYY");
    notesData[slug] = {
      title,
      createdDate,
      content: `# ${title}\n\nYour content here...`,
    };

    localStorage.setItem("notes", JSON.stringify(notesData));
    return { success: true, slug };
  } catch (error) {
    console.error("Error creating note:", error);
    return { success: false, error: "Failed to create note" };
  }
}









