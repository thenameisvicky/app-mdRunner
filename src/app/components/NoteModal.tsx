"use client";

import { useEffect } from "react";
import { marked } from "marked";

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

export default function NoteModal({
  note,
  isOpen,
  onClose,
}: NoteModalProps) {
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !note) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(15, 15, 15, 0.1)",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="relative max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 32px rgba(15, 15, 15, 0.1)",
          border: "1px solid #e9e9e7",
          zIndex: 51,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            borderBottom: "1px solid #e9e9e7",
            padding: "24px",
          }}
        >
          <div className="flex-1">
            <h1 className="text-2xl font-bold" style={{ color: "#37352f" }}>
              {note.frontmatter.title || note.slug}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded"
              style={{
                background: "#ffffff",
                border: "1px solid #e9e9e7",
                color: "#37352f",
                cursor: "pointer",
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto"
          style={{
            padding: "24px",
            maxHeight: "calc(90vh - 140px)",
          }}
        >
          <div
            className="notion-content"
            style={{
              color: "#37352f",
              fontSize: "16px",
              lineHeight: "1.5",
              fontFamily:
                'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif',
              minHeight: "200px",
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: marked(note.content),
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between"
          style={{
            borderTop: "1px solid #e9e9e7",
            padding: "16px 24px",
            background: "#f7f6f3",
          }}
        >
          <div className="text-sm" style={{ color: "#787774" }}>
            {note.frontmatter.date && (
              <span>Created: {note.frontmatter.date}</span>
            )}
            <span className="ml-4">Press Escape to close</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium rounded"
            style={{
              background: "#ffffff",
              border: "1px solid #e9e9e7",
              color: "#37352f",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
