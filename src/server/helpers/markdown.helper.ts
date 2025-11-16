import matter from "gray-matter";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";

const vaultPath = path.join(process.cwd(), "vault");

export function getAllNotes() {
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
