import NotesGrid from "./components/NotesGrid";
import KuralHeader from "./components/KuralHeader";
import { getAllNotes } from "@/server/helpers/markdown.helper";

export default function Home() {
  const allMarkDowns = getAllNotes();

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
        <KuralHeader />
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
