"use client";

import { useState, useEffect } from "react";
import NoteModal from "./NoteModal";
import Tooltip from "../common/Tooltip";
import BookmarkIcon from "../common/BookmarkIcon";
import { isDevelopment } from "@/app/constants";
import { Note } from "../types";
import { readPreferencesFromClient, writePreferencesToClient } from "../helpers/userPreference.client";
import { getUserPreferences, toggleBookmark } from "../actions/dbActions";

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
    const loadBookmarks = async () => {
      try {
        if (isDevelopment) {
          // In dev, use server action
          const data = await getUserPreferences();
          if (data.bookMarkedCards && Array.isArray(data.bookMarkedCards)) {
            setBookmarkedNotes(new Set(data.bookMarkedCards));
          }
        } else {
          // In prod, read from localStorage
          if (typeof window === "undefined") return;
          const prefs = readPreferencesFromClient();
          if (prefs.bookMarkedCards && Array.isArray(prefs.bookMarkedCards)) {
            setBookmarkedNotes(new Set(prefs.bookMarkedCards));
          }
        }
      } catch (err) {
        console.error("Error loading preferences:", err);
      }
    };
    loadBookmarks();
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
      if (isDevelopment) {
        // In dev, use server action
        await toggleBookmark(note.slug, newBookmarked);
      } else {
        // In prod, use localStorage
        if (typeof window === "undefined") return;
        const prefs = readPreferencesFromClient();
        
        if (newBookmarked) {
          if (!prefs.bookMarkedCards.includes(note.slug)) {
            prefs.bookMarkedCards.push(note.slug);
          }
        } else {
          prefs.bookMarkedCards = prefs.bookMarkedCards.filter((slug: string) => slug !== note.slug);
        }
        
        writePreferencesToClient(prefs);
      }
    } catch (error) {
      setBookmarkedNotes(bookmarkedNotes);
      console.error("Error updating bookmark:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-visible">
        {notes.map((note, index) => {
          const isBookmarked = bookmarkedNotes.has(note.slug);
          return (
            <div
              className="cursor-pointer transition-all duration-150 ease-out relative p-4 border border-[#e9e9e7] rounded-lg bg-white shadow-[0_1px_3px_rgba(15,15,15,0.1)] min-h-[200px] flex flex-col overflow-visible z-[1] hover:shadow-[0_2px_8px_rgba(15,15,15,0.2)] hover:border-[#d9d9d7] hover:-translate-y-[1px] hover:z-10"
              onClick={() => handleCardClick(note)}
              key={index}
            >
              <div className="absolute -top-2 right-2 z-20">
                <Tooltip
                  content={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                  position="top"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmarkClick(e, note);
                    }}
                    className="cursor-pointer inline-flex"
                  >
                    <BookmarkIcon
                      isBookmarked={isBookmarked}
                      size={24}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmarkClick(e, note);
                      }}
                      aria-label={
                        isBookmarked ? "Remove bookmark" : "Add bookmark"
                      }
                    />
                  </div>
                </Tooltip>
              </div>
              <div className="flex items-center gap-5">
                <h2 className="text-xl font-bold text-[#37352f] m-0 flex-1">
                  {note.frontmatter.title || note.slug}
                </h2>
              </div>
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
