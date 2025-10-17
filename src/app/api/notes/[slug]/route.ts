import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const vaultPath = path.join(process.cwd(), 'vault');

export async function PUT(request: NextRequest) {
  try {
    const { slug, content, frontmatter } = await request.json();
    
    if (!slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const fileName = `${slug}.md`;
    const fullPath = path.join(vaultPath, fileName);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Create the markdown content with frontmatter
    const fileContent = matter.stringify(content, frontmatter || {});
    
    // Write the file
    fs.writeFileSync(fullPath, fileContent, 'utf8');
    
    return NextResponse.json({ success: true, message: 'File saved successfully' });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}
