import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/notes';

const apiService = {
  getAllNotes: () => axios.get(API_BASE_URL),
  createNote: (noteData) => axios.post(API_BASE_URL, noteData),
  updateNote: (id, noteData) => axios.put(`${API_BASE_URL}/${id}`, noteData),
  deleteNote: (id) => axios.delete(`${API_BASE_URL}/${id}`),
  searchNotes: (keyword) => axios.get(`${API_BASE_URL}/search?keyword=${keyword}`)
};

export default apiService;