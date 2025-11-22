import NotesGrid from "./components/NotesGrid";
import KuralHeader from "./components/KuralHeader";
import { getAllNotes } from "@/server/helpers/markdown.helper";

export default function Home() {
  const allMarkDowns = getAllNotes();

  return (
    <div className="min-h-screen notion-bg bg-[#f7f6f3]">
      <div className="border-b bg-white border-[#e9e9e7] p-6">
        <h1 className="text-2xl font-bold text-[#37352f]">
          MD Runner
        </h1>
        <KuralHeader />
      </div>
      <div className="p-6">
        {allMarkDowns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-[#787774]">
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
