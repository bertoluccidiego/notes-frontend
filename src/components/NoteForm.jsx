import { useState } from 'react';

import notesService from '../services/notes';

function NoteForm({ notes, setNotes, noteFormRef }) {
  const [newNote, setNewNote] = useState('');

  async function addNote(event) {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    };

    try {
      const addedNote = await notesService.create(noteObject);
      setNotes(notes.concat(addedNote));
      setNewNote('');
      noteFormRef.current.toggleVisibility();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={({ target }) => setNewNote(target.value)}
      />
      <button type="submit">save</button>
    </form>
  );
}

export default NoteForm;
