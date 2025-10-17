import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const vaultPath = path.join(process.cwd(), 'vault');

export async function GET() {
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
        frontmatter = parsed.data;
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

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error reading markdown files:', error);
    return NextResponse.json({ error: 'Failed to read notes' }, { status: 500 });
  }
}
