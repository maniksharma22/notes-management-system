import { useEffect, useState } from 'react';
import { Trash2, Edit2, Search, SearchX, Calendar, Clock, Pin, PlusCircle, ChevronRight } from 'lucide-react';
import apiService from '../services/apiService';

const NoteCard = ({ note, onEdit, onView, setDeleteId, onPin }) => {
    const isBigNote = note.content && note.content.replace(/<[^>]*>/g, '').length > 150;

    return (
        <div 
            onClick={() => onView(note)} 
            className={`relative bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 flex flex-col hover:shadow-lg group cursor-pointer hover:-translate-y-0.5 ${note.isPinned ? 'border-indigo-200 ring-1 ring-indigo-50' : ''}`}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 ${note.isPinned ? 'bg-indigo-600' : 'bg-indigo-500 opacity-0 group-hover:opacity-100 group-hover:w-[4px]'}`}></div>
            
            <div className="flex justify-between items-start mb-2 pl-2">
                <h3 className="font-bold text-base md:text-lg text-gray-900 truncate flex-1 group-hover:text-indigo-600">
                    {note.title || "Untitled Note"}
                </h3>
                <button 
                    onClick={(e) => { e.stopPropagation(); onPin(note); }} 
                    className={`ml-2 p-1.5 rounded-lg transition-colors cursor-pointer z-10 ${note.isPinned ? 'text-indigo-600 bg-indigo-50' : 'text-gray-300 hover:text-indigo-600'}`}
                >
                    <Pin size={16} fill={note.isPinned ? "currentColor" : "none"} />
                </button>
            </div>

            <div 
                className="text-gray-500 mb-5 text-sm flex-grow line-clamp-3 leading-relaxed pl-2 ql-editor pointer-events-none" 
                dangerouslySetInnerHTML={{ __html: note.content || "" }} 
            />

            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 mb-5 uppercase tracking-wider pl-2">
                <span className="flex items-center gap-1.5"><Calendar size={13} />{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ""}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} />{note.updatedAt ? new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                <div>
                    {isBigNote && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onView(note); }}
                            className="flex items-center gap-1 text-[11px] font-black uppercase tracking-tighter text-indigo-600 hover:text-indigo-700 cursor-pointer"
                        >
                            View More <ChevronRight size={14} />
                        </button>
                    )}
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(note)} className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"><Edit2 size={16} /></button>
                    <button onClick={() => setDeleteId(note.id)} className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                </div>
            </div>
        </div>
    );
};

const NoteList = ({ onEdit, onView, onError, onDeleteSuccess, onPinToggle }) => {
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState(null);

    const sortNotes = (notesArray) => {
        return [...notesArray].sort((a, b) => {
            if (a.isPinned === b.isPinned) return new Date(b.updatedAt) - new Date(a.updatedAt);
            return a.isPinned ? -1 : 1;
        });
    };

    const fetchNotes = async () => {
        try {
            const res = searchQuery && searchQuery.trim() !== '' 
                ? await apiService.searchNotes(searchQuery) 
                : await apiService.getAllNotes();
            setNotes(sortNotes(res.data || []));
        } catch (err) {
            onError("Failed to load notes.");
        }
    };

    useEffect(() => { fetchNotes(); }, [searchQuery]);

    const handlePin = async (note) => {
        const updatedStatus = !note.isPinned;
        const updatedNotes = notes.map(n => n.id === note.id ? { ...n, isPinned: updatedStatus } : n);
        setNotes(sortNotes(updatedNotes));

        try {
            await apiService.updateNote(note.id, { ...note, isPinned: updatedStatus });
            if (onPinToggle) onPinToggle(updatedStatus);
        } catch (err) {
            fetchNotes();
            onError("Failed to update pin.");
        }
    };

    const handleDelete = async () => {
        try {
            await apiService.deleteNote(deleteId);
            setNotes(notes.filter(n => n.id !== deleteId));
            onDeleteSuccess();
            setDeleteId(null);
        } catch (err) { onError("Deletion failed"); }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-7xl mx-auto overflow-hidden">
            <div className="px-4 md:px-6 pt-6 md:pt-8 pb-4 flex-shrink-0">
                <div className="relative w-full">
                    <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                    <input
                        className="w-full pl-12 md:pl-14 pr-5 py-3 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-sm md:text-base shadow-sm cursor-text"
                        placeholder="Search notes..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-2">
                {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <SearchX size={48} className="mb-4 text-indigo-100" />
                        <p className="text-lg font-bold text-gray-700">No notes found</p>
                        <button onClick={onEdit} className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors cursor-pointer">
                            <PlusCircle size={18} /> Create Note
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-8">
                        {notes.map((note) => (
                            <NoteCard key={note.id} note={note} onEdit={onEdit} onView={onView} setDeleteId={setDeleteId} onPin={handlePin} />
                        ))}
                    </div>
                )}
            </div>

            {deleteId && (
                <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 md:p-8 rounded-3xl max-w-xs w-full shadow-2xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Note?</h3>
                        <p className="text-gray-500 mb-6 text-sm">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl bg-gray-100 font-bold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold cursor-pointer hover:bg-red-700 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoteList;
