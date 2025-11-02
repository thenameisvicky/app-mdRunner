'use client';

import { useState } from 'react';
import NoteModal from "./NoteModal";

type Note = {
  slug: string,
  frontmatter: any,
  content: string
}

type NotesGridProps = {
  notes: Note[];
}

export default function NotesGrid({ notes }: NotesGridProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notes.map((note, index) => (
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
            onClick={() => handleCardClick(note)}
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
            key={index}
          >
            <h2 className="text-xl font-bold mb-2" style={{ color: "#37352f" }}>
              {note.frontmatter.filename || note.slug}
            </h2>
          </div>
        ))}
      </div>

      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
