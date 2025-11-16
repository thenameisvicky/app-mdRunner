import NotesGrid from "./components/NotesGrid";
import { getAllNotes } from "../utils/notes";
import { THIRUKKURAL_TAMIL } from "@/utils/constants";

export default function Home() {
  const allMarkDowns = getAllNotes();
  const kural =
    THIRUKKURAL_TAMIL[Math.floor(Math.random() * THIRUKKURAL_TAMIL.length)];

  return (
    <div className="min-h-screen notion-bg" style={{ background: "#f7f6f3" }}>
      <div
        className="border-b"
        style={{
          background: "#ffffff",
          borderColor: "#e9e9e7",
          padding: "24px",
        }}
      >
        <h1 className="text-2xl font-bold" style={{ color: "#37352f" }}>
          MD Runner
        </h1>
        <p className="mt-1" style={{ color: "#000000" }}>
          {kural.split(";")}
        </p>
      </div>
      <div style={{ padding: "24px" }}>
        {allMarkDowns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: "#787774" }}>
              No notes found in the vault.
            </p>
          </div>
        ) : (
          <NotesGrid notes={allMarkDowns} />
        )}
      </div>
    </div>
  );
}
