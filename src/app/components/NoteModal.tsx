"use client";

import { useEffect, useState } from "react";
import Button from "../common/Button";
import CollapsibleMarkdown from "./CollapsibleMarkdown";

type Note = {
  slug: string;
  frontmatter: Record<string, string>;
  content: string;
};

type NoteModalProps = {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function NoteModal({ note, isOpen, onClose }: NoteModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "hidden";
      fetch("/api", {
        method: "GET",
        headers: {
          "x-file-name": "userPreferences",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.bookMarkedCards && Array.isArray(data.bookMarkedCards)) {
            setIsBookmarked(data.bookMarkedCards.includes(note?.slug));
          }
        })
        .catch((err) => console.error("Error loading bookmark status:", err));
    }

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, note, onClose]);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!note) return;
  };

  if (!isOpen || !note) return null;

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
            <h1 className="text-2xl font-bold text-[#37352f]">
              {note.frontmatter.title || note.slug}
            </h1>
          </div>
          <div className="flex items-center gap-2">
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
          <div className="notion-content text-[#37352f] text-base leading-[1.5] font-sans min-h-[200px]">
            <CollapsibleMarkdown content={note.content} />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#e9e9e7] px-6 py-4 bg-[#f7f6f3]">
          <div className="text-sm text-[#787774]">
            {note.frontmatter.date && (
              <span>Created: {note.frontmatter.date}</span>
            )}
            <span className="ml-4">Press Escape to close</span>
          </div>
          <Button
            variant="text"
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium rounded"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
