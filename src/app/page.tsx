import NotesGrid from "./components/NotesGrid";
import { getAllNotes } from "../utils/notes";
import { STAY_HARD_CHAD } from "@/utils/constants";

export default function Home() {
  const allMarkDowns = getAllNotes();
  const moto = STAY_HARD_CHAD[Math.floor(Math.random() * STAY_HARD_CHAD.length)];

  return (
    <div className="min-h-screen" style={{ background: '#f7f6f3' }}>
      {/* Header */}
      <div className="border-b" style={{
        background: '#ffffff',
        borderColor: '#e9e9e7',
        padding: '24px'
      }}>
        <h1 className="text-2xl font-bold" style={{ color: '#37352f' }}>MD Runner</h1>
        <p className="mt-1" style={{ color: '#787774' }}>{moto}</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px' }}>
        {allMarkDowns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: '#787774' }}>No notes found in the vault.</p>
          </div>
        ) : (
          <NotesGrid notes={allMarkDowns} />
        )}
      </div>
    </div>
  );
}
