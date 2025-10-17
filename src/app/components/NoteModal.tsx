"use client";

import { useEffect, useState, useCallback } from "react";
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
  onSave?: (updatedNote: Note) => void;
};

export default function NoteModal({
  note,
  isOpen,
  onClose,
  onSave,
}: NoteModalProps) {
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize content when note changes
  useEffect(() => {
    if (note) {
      setEditedContent(note.content);
      setEditedTitle(note.frontmatter.title || note.slug);
      setIsEditing(false);
    }
  }, [note]);

  const handleSave = useCallback(async () => {
    if (!note) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/notes/${note.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: note.slug,
          content: editedContent,
          frontmatter: {
            ...note.frontmatter,
            title: editedTitle,
          },
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        // Call the onSave callback to update the parent component
        if (onSave) {
          onSave({
            ...note,
            content: editedContent,
            frontmatter: {
              ...note.frontmatter,
              title: editedTitle,
            },
          });
        }
      } else {
        console.error("Failed to save note");
        alert("Failed to save note. Please try again.");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Error saving note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [note, editedContent, editedTitle, onSave]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isEditing) {
          setIsEditing(false);
        } else {
          onClose();
        }
      }

      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (isEditing && !isSaving) {
          handleSave();
        }
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
  }, [isOpen, onClose, isEditing, isSaving, handleSave]);

  const handleCancel = () => {
    if (note) {
      setEditedContent(note.content);
      setEditedTitle(note.frontmatter.title || note.slug);
    }
    setIsEditing(false);
  };

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
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-2xl font-bold w-full border-none outline-none bg-transparent"
                style={{ color: "#37352f" }}
                placeholder="Untitled"
              />
            ) : (
              <h1 className="text-2xl font-bold" style={{ color: "#37352f" }}>
                {note.frontmatter.filename || note.slug}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-3 py-1.5 text-sm font-medium rounded text-white"
                  style={{
                    background: isSaving ? "#9b9a97" : "#2383e2",
                    border: "none",
                    cursor: isSaving ? "not-allowed" : "pointer",
                  }}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-3 py-1.5 text-sm font-medium rounded"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e9e9e7",
                    color: "#37352f",
                    cursor: isSaving ? "not-allowed" : "pointer",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-sm font-medium rounded text-white"
                style={{
                  background: "#2383e2",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
            )}
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
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-full min-h-[400px] resize-none"
              style={{
                fontFamily:
                  'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif',
                fontSize: "14px",
                padding: "8px",
                border: "1px solid #e9e9e7",
                borderRadius: "3px",
                background: "#ffffff",
                color: "#37352f",
                outline: "none",
              }}
              placeholder="Type '/' for commands..."
            />
          ) : (
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
          )}
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
            {isEditing ? (
              <span>Press Ctrl+S to save</span>
            ) : (
              <>
                {note.frontmatter.date && (
                  <span>Created: {note.frontmatter.date}</span>
                )}
                <span className="ml-4">Press Escape to close</span>
              </>
            )}
          </div>
          {!isEditing && (
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
          )}
        </div>
      </div>
    </div>
  );
}
