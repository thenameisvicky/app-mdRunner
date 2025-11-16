"use client";

import { useState, useEffect } from "react";
import NoteModal from "./NoteModal";
import Button from "../common/Button";
import Tooltip from "../common/Tooltip";

type Note = {
  slug: string;
  frontmatter: Record<string, string>;
  content: string;
};

type NotesGridProps = {
  notes: Note[];
};

export default function NotesGrid({ notes }: NotesGridProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetch("/api", {
      method: "GET",
      headers: {
        "x-file-name": "userPreferences",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.bookMarkedCards && Array.isArray(data.bookMarkedCards)) {
          setBookmarkedNotes(new Set(data.bookMarkedCards));
        }
      })
      .catch((err) => console.error("Error loading preferences:", err));
  }, []);

  const handleCardClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleBookmarkClick = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    const isBookmarked = bookmarkedNotes.has(note.slug);
    const newBookmarked = !isBookmarked;

    const newBookmarkedSet = new Set(bookmarkedNotes);
    if (newBookmarked) {
      newBookmarkedSet.add(note.slug);
    } else {
      newBookmarkedSet.delete(note.slug);
    }
    setBookmarkedNotes(newBookmarkedSet);

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-file-name": "userPreferences",
        },
        body: JSON.stringify({
          slug: note.slug,
          bookmarked: newBookmarked,
        }),
      });

      if (!response.ok) {
        setBookmarkedNotes(bookmarkedNotes);
        console.error("Failed to update bookmark");
      }
    } catch (error) {
      setBookmarkedNotes(bookmarkedNotes);
      console.error("Error updating bookmark:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={{ overflow: "visible" }}>
        {notes.map((note, index) => {
          const isBookmarked = bookmarkedNotes.has(note.slug);
          return (
            <div
              className="cursor-pointer transition-all duration-150 ease-out hover:shadow-lg relative"
              style={{
                padding: "16px",
                border: "1px solid #e9e9e7",
                borderRadius: "8px",
                background: "#ffffff",
                boxShadow: "0 1px 3px rgba(15, 15, 15, 0.1)",
                minHeight: "200px",
                display: "flex",
                justifyContent: "space-between",
                overflow: "visible",
                zIndex: 1,
              }}
              onClick={() => handleCardClick(note)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(15, 15, 15, 0.2)";
                e.currentTarget.style.borderColor = "#d9d9d7";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.zIndex = "10";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(15, 15, 15, 0.1)";
                e.currentTarget.style.borderColor = "#e9e9e7";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.zIndex = "1";
              }}
              key={index}
            >
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "#37352f" }}
              >
                {note.frontmatter.filename || note.slug}
              </h2>
              <Tooltip
                content={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                position="top"
              >
                <Button
                  variant="icon"
                  onClick={(e) => handleBookmarkClick(e, note)}
                  className="p-1.5 rounded transition-colors"
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={isBookmarked ? "#FFD700" : "none"}
                    stroke={isBookmarked ? "#FFD700" : "#787774"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </Button>
              </Tooltip>
            </div>
          );
        })}
      </div>

      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
