import { useState } from 'react';
import AddNote from './components/AddNote';
import NoteList from './components/NoteList';
import { Toaster, toast } from 'react-hot-toast';
import { PlusSquare, BookOpen, X, CheckCircle2, AlertCircle, Menu } from 'lucide-react';

const App = () => {
  const [view, setView] = useState('create');
  const [viewNote, setViewNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    const id = `${type}-${message}`;
    toast.custom(
      (t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} pointer-events-auto max-w-md w-full bg-white shadow-xl rounded-2xl border border-gray-100 flex items-center p-4`}>
          <div className="flex-shrink-0">
            {type === 'success' ? <CheckCircle2 className="text-indigo-600" size={24} /> : <AlertCircle className="text-red-500" size={24} />}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-bold text-gray-900">{message}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); toast.remove(id); }} className="ml-4 text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      ),
      { id, duration: 3000 }
    );
  };

  const handleError = (message) => showToast(message || "An unexpected error occurred.", 'error');

  const navigate = (target) => {
    if (target === 'create') setEditingNote(null);
    setView(target);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 p-8 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-black text-indigo-600">DOC-AI</h1>
          <X className="md:hidden cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setIsMenuOpen(false)} />
        </div>
        <nav className="space-y-10">
          <div>
            <p className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">Workspace</p>
            <button onClick={() => navigate('create')} className="w-full flex items-center gap-4 font-bold p-3 hover:text-indigo-600 cursor-pointer transition-all">
              <PlusSquare size={20} /> New Note
            </button>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">Library</p>
            <button onClick={() => navigate('list')} className="w-full flex items-center gap-4 font-bold p-3 hover:text-indigo-600 cursor-pointer transition-all">
              <BookOpen size={20} /> All Notes
            </button>
          </div>
        </nav>
      </aside>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}

      <div className="md:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center z-30">
        <h1 className="text-xl font-black text-indigo-600">DOC-AI</h1>
        <Menu className="cursor-pointer text-gray-600" onClick={() => setIsMenuOpen(true)} />
      </div>

      <main className="flex-1 h-full overflow-hidden relative">
        {view === 'create' ? (
          <AddNote 
            initialData={editingNote} 
            onNoteAdded={(isUpdate) => { setEditingNote(null); setView('list'); showToast(isUpdate ? "Note updated" : "Note created"); }} 
            onError={handleError} 
          />
        ) : (
          <NoteList 
            onView={setViewNote} 
            onEdit={(note) => { setEditingNote(note); setView('create'); }} 
            onError={handleError} 
            onDeleteSuccess={() => showToast("Note deleted")} 
            onPinToggle={(isPinned) => showToast(isPinned ? "Note pinned" : "Note unpinned")} 
          />
        )}
      </main>

      {viewNote && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] max-w-lg w-full shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-black truncate pr-4">{viewNote.title}</h2>
              <X className="cursor-pointer hover:text-indigo-600 shrink-0" onClick={() => setViewNote(null)} />
            </div>
            <div className="text-gray-700 text-base md:text-lg leading-relaxed ql-editor" dangerouslySetInnerHTML={{ __html: viewNote.content }} />
            <button onClick={() => setViewNote(null)} className="mt-8 w-full py-4 bg-gray-950 text-white rounded-2xl font-bold cursor-pointer hover:bg-indigo-600 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;