import matter from "gray-matter";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import { Note, NoteData } from "@/app/types";

const vaultPath = path.join(process.cwd(), "vault");
// Check NODE_ENV - in Next.js, this should be set by the build process
// For server-side code, we check both process.env.NODE_ENV and if it's undefined, assume development
const isDevelopment = 
  process.env.NODE_ENV === "development" || 
  (process.env.NODE_ENV === undefined && !process.env.VERCEL);

function getAllNotesFromVault(): Note[] {
  try {
    const files = fs
      .readdirSync(vaultPath)
      .filter((file) => file.endsWith(".md"));

    const notes = files.map((fileName) => {
      const fullPath = path.join(vaultPath, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      let frontmatter: Record<string, string> = {};
      let content = fileContents;

      try {
        const parsed = matter(fileContents);
        frontmatter = Object.fromEntries(
          Object.entries(parsed.data).map(([key, value]) => [
            key,
            value instanceof Date
              ? dayjs(value).format("MMMM D, YYYY")
              : String(value),
          ])
        );
        content = parsed.content;
      } catch {
        content = fileContents;
        frontmatter = {};
      }

      if (!frontmatter.title) {
        const titleMatch = content.match(/^title:\s*(.+)$/m);
        if (titleMatch) {
          frontmatter.title = titleMatch[1].trim();
        }
      }

      if (!frontmatter.date) {
        const dateMatch = content.match(/^date:\s*(.+)$/m);
        if (dateMatch) {
          frontmatter.date = dateMatch[1].trim();
        }
      }

      return {
        slug: fileName.replace(".md", ""),
        frontmatter,
        content,
      };
    });
    return notes;
  } catch (error) {
    console.error("Error reading markdown files:", error);
    return [];
  }
}

function getAllNotesFromLocalStorage(): Note[] {
  if (typeof window === "undefined") return [];
  
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

export function getAllNotes(): Note[] {
  if (isDevelopment) {
    return getAllNotesFromVault();
  } else {
    return getAllNotesFromLocalStorage();
  }
}

export function createNote(title: string): { success: boolean; error?: string; slug?: string } {
  if (isDevelopment) {
    // Simulate file creation in dev
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const fileName = `${slug}.md`;
      const fullPath = path.join(vaultPath, fileName);
      
      if (fs.existsSync(fullPath)) {
        return { success: false, error: "Note with this title already exists" };
      }

      const createdDate = dayjs().format("MMMM D, YYYY");
      const content = `---
title: ${title}
date: ${createdDate}
---

# ${title}

Your content here...
`;

      fs.writeFileSync(fullPath, content, "utf8");
      return { success: true, slug };
    } catch (error) {
      console.error("Error creating note:", error);
      return { success: false, error: "Failed to create note" };
    }
  } else {
    // Write to localStorage in production
    if (typeof window === "undefined") {
      return { success: false, error: "Window not available" };
    }

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
}

export function noteExists(title: string): boolean {
  if (isDevelopment) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const fileName = `${slug}.md`;
    const fullPath = path.join(vaultPath, fileName);
    return fs.existsSync(fullPath);
  } else {
    if (typeof window === "undefined") return false;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const stored = localStorage.getItem("notes");
    if (!stored) return false;
    const notesData: Record<string, NoteData> = JSON.parse(stored);
    return !!notesData[slug];
  }
}
