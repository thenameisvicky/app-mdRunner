import "server-only";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import { Note } from "@/app/types";

const vaultPath = path.join(process.cwd(), "vault");

export function getAllNotesFromVault(): Note[] {
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

export function createNoteInVault(title: string): { success: boolean; error?: string; slug?: string } {
  try {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const fileName = `${slug}.md`;
    const fullPath = path.join(vaultPath, fileName);
    
    if (fs.existsSync(fullPath)) {
      return { success: false, error: "Note with this title already exists" };
    }

    const createdDate = dayjs().format("MMMM D, YYYY");
    const content = `---\ntitle: ${title}\ndate: ${createdDate}\n---\n\n# ${title}\n\nYour content here...`;

    fs.writeFileSync(fullPath, content, "utf8");
    return { success: true, slug };
  } catch (error) {
    console.error("Error creating note:", error);
    return { success: false, error: "Failed to create note" };
  }
}


