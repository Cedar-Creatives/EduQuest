import api from './api';

// Description: Get all available notes
// Endpoint: GET /api/notes
// Request: {}
// Response: { success: boolean, notes: Array<{ _id: string, title: string, description: string, subject: string, author: string, authorName: string, readTime: number, rating: number, reviews: number, views: number, createdAt: string }> }
export const getNotes = async () => {
  try {
    const response = await api.get('/api/notes');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Get a specific note by ID
// Endpoint: GET /api/notes/:noteId
// Request: {}
// Response: { success: boolean, note: { _id: string, title: string, content: string, subject: string, author: string, authorName: string, readTime: number, rating: number, reviews: number, views: number, createdAt: string } }
export const getNote = async (noteId: string) => {
  try {
    const response = await api.get(`/api/notes/${noteId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Upload a new note (Premium feature)
// Endpoint: POST /api/notes
// Request: { title: string, content: string, subject: string, description?: string, isPublic?: boolean, tags?: string[] }
// Response: { success: boolean, message: string, noteId: string, note: object }
export const uploadNote = async (data: { title: string; content: string; subject: string; description?: string; isPublic?: boolean; tags?: string[] }) => {
  try {
    const response = await api.post('/api/notes', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Update an existing note
// Endpoint: PUT /api/notes/:noteId
// Request: { title?: string, content?: string, subject?: string, description?: string, isPublic?: boolean, tags?: string[] }
// Response: { success: boolean, message: string, note: object }
export const updateNote = async (noteId: string, data: { title?: string; content?: string; subject?: string; description?: string; isPublic?: boolean; tags?: string[] }) => {
  try {
    const response = await api.put(`/api/notes/${noteId}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Delete a note
// Endpoint: DELETE /api/notes/:noteId
// Request: {}
// Response: { success: boolean, message: string }
export const deleteNote = async (noteId: string) => {
  try {
    const response = await api.delete(`/api/notes/${noteId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Search notes
// Endpoint: GET /api/notes/search
// Request: { q: string }
// Response: { success: boolean, notes: Array<object> }
export const searchNotes = async (query: string) => {
  try {
    const response = await api.get(`/api/notes/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Get user's own notes only
// Endpoint: GET /api/notes/my
// Request: {}
// Response: { success: boolean, notes: Array<object> }
export const getUserNotes = async () => {
  try {
    const response = await api.get('/api/notes/my');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}