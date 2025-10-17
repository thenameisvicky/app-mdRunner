import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const vaultPath = path.join(process.cwd(), 'vault');

function formatDate(date: Date): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

export function getAllNotes() {
  try {
    const files = fs.readdirSync(vaultPath).filter((file) => file.endsWith('.md'));

    const notes = files.map((fileName) => {
      const fullPath = path.join(vaultPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // Try to parse with gray-matter first
      let frontmatter: Record<string, string> = {};
      let content = fileContents;
      
      try {
        const parsed = matter(fileContents);
        // Convert all frontmatter values to strings to avoid Date objects
        frontmatter = Object.fromEntries(
          Object.entries(parsed.data).map(([key, value]) => [
            key, 
            value instanceof Date ? formatDate(value) : String(value)
          ])
        );
        content = parsed.content;
      } catch {
        // If parsing fails, treat the whole file as content
        content = fileContents;
        frontmatter = {};
      }
      
      // Extract title and date from content if not in frontmatter
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
        slug: fileName.replace('.md', ''),
        frontmatter,
        content,
      };
    });

    return notes;
  } catch (error) {
    console.error('Error reading markdown files:', error);
    return [];
  }
}
