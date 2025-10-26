type Note = {
  slug: string;
  frontmatter: Record<string, string>;
  content: string;
};

type NoteCardProps = {
  note: Note;
  onClick: () => void;
};

export default function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <div
      className="cursor-pointer transition-all duration-150 ease-out hover:shadow-lg"
      style={{
        padding: "16px",
        border: "1px solid #e9e9e7",
        borderRadius: "8px",
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(15, 15, 15, 0.1)",
        minHeight: "200px",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(15, 15, 15, 0.2)";
        e.currentTarget.style.borderColor = "#d9d9d7";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(15, 15, 15, 0.1)";
        e.currentTarget.style.borderColor = "#e9e9e7";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <h2 className="text-xl font-bold mb-2" style={{ color: "#37352f" }}>
        {note.frontmatter.filename || note.slug}
      </h2>
      <p className="text-lg font-bold mb-3" style={{ color: "#9b9a97" }}>
        {note.frontmatter.title} - {note.frontmatter.date}
      </p>
    </div>
  );
}
