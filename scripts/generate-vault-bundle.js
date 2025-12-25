const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const dayjs = require('dayjs');

const vaultPath = path.join(process.cwd(), 'src', 'vault');
const outputPath = path.join(process.cwd(), 'public', 'vault-bundle.json');

function getAllNotesFromVault() {
  try {
    const files = fs
      .readdirSync(vaultPath)
      .filter((file) => file.endsWith('.md') && !file.startsWith('.'));

    const notes = files.map((fileName) => {
      const fullPath = path.join(vaultPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      let frontmatter = {};
      let content = fileContents;

      try {
        const parsed = matter(fileContents);
        frontmatter = Object.fromEntries(
          Object.entries(parsed.data).map(([key, value]) => [
            key,
            value instanceof Date
              ? dayjs(value).format('MMMM D, YYYY')
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
        } else {
          // Use filename as title
          frontmatter.title = fileName.replace('.md', '').replace(/-/g, ' ');
        }
      }

      if (!frontmatter.date) {
        const dateMatch = content.match(/^date:\s*(.+)$/m);
        if (dateMatch) {
          frontmatter.date = dateMatch[1].trim();
        } else {
          // Use file modification time
          const stats = fs.statSync(fullPath);
          frontmatter.date = dayjs(stats.mtime).format('MMMM D, YYYY');
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

// Generate the bundle
const notes = getAllNotesFromVault();

// Ensure public directory exists
const publicDir = path.dirname(outputPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the bundle
fs.writeFileSync(outputPath, JSON.stringify(notes, null, 2), 'utf8');
console.log(`✅ Generated vault bundle with ${notes.length} notes at ${outputPath}`);

