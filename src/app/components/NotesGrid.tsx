'use client';

import { useState } from 'react';
import NoteCard from "../noteCard/NoteCard";
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
        {notes.map((note) => (
          <NoteCard 
            key={note.slug} 
            note={note} 
            onClick={() => handleCardClick(note)}
          />
        ))}
      </div>

      {/* Modal */}
      <NoteModal 
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
