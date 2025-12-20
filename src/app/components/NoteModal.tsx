"use client";

import { useEffect, useState } from "react";
import Button from "../common/Button";
import CollapsibleMarkdown from "./CollapsibleMarkdown";
import BookmarkIcon from "../common/BookmarkIcon";
import dayjs from "dayjs";
import { Note, CreateNoteResponse } from "../types";
import { readPreferencesFromClient, writePreferencesToClient } from "../helpers/userPreference.client";
import { getUserPreferences, toggleBookmark } from "../actions/dbActions";
import { isDevelopment } from "../constants";

type NoteModalProps = {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  mode?: "view" | "create";
  onCreateNote?: (title: string) => Promise<CreateNoteResponse>;
};

export default function NoteModal({ note, isOpen, onClose, mode = "view", onCreateNote }: NoteModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const isCreateMode = mode === "create";

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "hidden";
      
      if (!isCreateMode && note) {
        const loadBookmarkStatus = async () => {
          if (typeof window === "undefined") return;
          
          try {
            if (isDevelopment) {
              const data = await getUserPreferences();
              if (data.bookMarkedCards && Array.isArray(data.bookMarkedCards)) {
                setIsBookmarked(data.bookMarkedCards.includes(note?.slug || ""));
              }
            } else {
              const prefs = readPreferencesFromClient();
              if (prefs.bookMarkedCards && Array.isArray(prefs.bookMarkedCards)) {
                setIsBookmarked(prefs.bookMarkedCards.includes(note?.slug || ""));
              }
            }
          } catch (err) {
            console.error("Error loading bookmark status:", err);
          }
        };
        loadBookmarkStatus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, note, onClose, isCreateMode]);

  useEffect(() => {
    if (isCreateMode && isOpen) {
      setTitle("");
    }
  }, [isCreateMode, isOpen]);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!note || isCreateMode) return;

    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    
    try {
      if (isDevelopment) {
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
      setIsBookmarked(isBookmarked);
      console.error("Error updating bookmark:", error);
    }
  };

  const handleCreateNote = async () => {
    if (!title.trim() || !onCreateNote) return;
    
    setIsCreating(true);
    const result = await onCreateNote(title.trim());
    setIsCreating(false);
    
    if (result.success) {
      onClose();
      setTitle("");
    } else {
      // Error will be handled by parent component via toast
    }
  };

  if (!isOpen) return null;
  if (!isCreateMode && !note) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[rgba(15,15,15,0.1)] backdrop-blur-[2px] z-[9998]"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden bg-white rounded-lg shadow-[0_4px_32px_rgba(15,15,15,0.1)] border border-[#e9e9e7] z-[9999]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e9e9e7] p-6">
          <div className="flex-1">
            {isCreateMode ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="text-2xl font-bold text-[#37352f] bg-transparent border-none outline-none w-full"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateNote();
                  }
                }}
              />
            ) : (
              <h1 className="text-2xl font-bold text-[#37352f]">
                {note?.frontmatter.title || note?.slug}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isCreateMode && note && (
              <BookmarkIcon
                isBookmarked={isBookmarked}
                size={24}
                onClick={handleBookmarkClick}
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              />
            )}
            <Button
              variant="icon"
              onClick={onClose}
              className="p-1.5 rounded hover:bg-gray-100 text-[#37352f]"
              aria-label="Close modal"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="text-[#37352f]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>
        <div
          className="overflow-y-auto p-6"
          style={{ maxHeight: "calc(90vh - 140px)" }}
        >
          {isCreateMode ? (
            <div className="text-[#37352f] text-base leading-[1.5] font-sans">
              <div className="mb-4 p-4 bg-[#f7f6f3] rounded-lg border border-[#e9e9e7]">
                <h3 className="text-lg font-semibold mb-2 text-[#37352f]">Note Template Preview</h3>
                <div className="text-sm text-[#787774] space-y-1">
                  <p><strong>Title:</strong> {title || "Your note title"}</p>
                  <p><strong>Created Date:</strong> {dayjs().format("MMMM D, YYYY")}</p>
                  <p className="mt-2 text-[#37352f]">Content editing will be available in a future update.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="notion-content text-[#37352f] text-base leading-[1.5] font-sans min-h-[200px]">
              <CollapsibleMarkdown content={note?.content || ""} />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-[#e9e9e7] px-6 py-4 bg-[#f7f6f3]">
          <div className="text-sm text-[#787774]">
            {isCreateMode ? (
              <span>Press Enter to create, Escape to cancel</span>
            ) : (
              <>
                {note?.frontmatter.date && (
                  <span>Created: {note.frontmatter.date}</span>
                )}
                <span className="ml-4">Press Escape to close</span>
              </>
            )}
          </div>
          {isCreateMode ? (
            <div className="flex gap-2">
              <Button
                variant="text"
                onClick={onClose}
                className="px-3 py-1.5 text-sm font-medium rounded"
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleCreateNote}
                className="px-3 py-1.5 text-sm font-medium rounded"
                disabled={!title.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create Note"}
              </Button>
            </div>
          ) : (
            <Button
              variant="text"
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-medium rounded"
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
