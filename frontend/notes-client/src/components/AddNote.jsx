import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { PlusCircle } from 'lucide-react';
import apiService from '../services/apiService';

const AddNote = ({ onNoteAdded, initialData, onError }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return onError("Title is required!");
        
        try {
            const noteData = { title, content };
            if (initialData) {
                await apiService.updateNote(initialData.id, noteData);
                onNoteAdded(true);
            } else {
                await apiService.createNote(noteData);
                onNoteAdded(false);
            }
        } catch (err) { 
            onError("Failed to save."); 
        }
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm max-w-4xl w-full mx-auto mt-2 md:mt-4 mb-10"
            >
                <h2 className="text-lg md:text-xl font-black text-gray-950 mb-6">
                    {initialData ? "Update Note" : "Create New Note"}
                </h2>
                
                <input 
                    className="w-full p-4 mb-6 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-indigo-600 font-bold text-base md:text-lg cursor-text transition-all"
                    placeholder="Title..." 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    required 
                />

                <div className="rounded-2xl overflow-hidden bg-gray-50 border-2 border-transparent focus-within:border-indigo-600 transition-all">
                    <ReactQuill 
                        theme="snow" 
                        value={content} 
                        onChange={setContent}
                        className="h-[250px] md:h-[300px]"
                        placeholder="Start writing your note here..."
                        modules={{
                            toolbar: [
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                [{ 'color': [] }],
                                ['image'] 
                            ]
                        }}
                    />
                </div>

                <div className="mt-20 md:mt-24">
                    <button 
                        type="submit" 
                        className="flex items-center gap-3 bg-indigo-600 text-white w-full py-4 rounded-xl font-black uppercase tracking-widest justify-center cursor-pointer hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                        <PlusCircle size={20} /> {initialData ? "Update Note" : "Create Note"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNote;