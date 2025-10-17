'use client';

import { useState, useEffect } from 'react';
import NoteCard from "./noteCard/NoteCard";
import NoteModal from "./components/NoteModal";

type Note = {
    slug: string,
    frontmatter: any,
    content: string
}

export default function Home() {
  const [allMarkDowns, setAllMarkDowns] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes');
        if (response.ok) {
          const notes = await response.json();
          setAllMarkDowns(notes);
        } else {
          console.error('Failed to fetch notes');
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleCardClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleSaveNote = (updatedNote: Note) => {
    // Update the note in the list
    setAllMarkDowns(prevNotes => 
      prevNotes.map(note => 
        note.slug === updatedNote.slug ? updatedNote : note
      )
    );
    // Update the selected note if it's the same one
    if (selectedNote && selectedNote.slug === updatedNote.slug) {
      setSelectedNote(updatedNote);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f7f6f3' }}>
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: '#2383e2' }}
          ></div>
          <p className="mt-4" style={{ color: '#787774' }}>Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#f7f6f3' }}>
      {/* Header */}
      <div className="border-b" style={{ 
        background: '#ffffff', 
        borderColor: '#e9e9e7',
        padding: '24px'
      }}>
        <h1 className="text-2xl font-bold" style={{ color: '#37352f' }}>Obsidian Notes</h1>
        <p className="mt-1" style={{ color: '#787774' }}>Click on any card to view the full content</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px' }}>
        {allMarkDowns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: '#787774' }}>No notes found in the vault.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allMarkDowns.map((note) => (
              <NoteCard 
                key={note.slug} 
                note={note} 
                onClick={() => handleCardClick(note)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <NoteModal 
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNote}
      />
    </div>
  );
}
