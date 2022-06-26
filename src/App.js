import { useState, useEffect } from 'react';

import Note from './components/Note';
import Notification from './components/Notification';
import Footer from './components/Footer';

import notesService from './services/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    notesService
      .getAll()
      .then((fetchedNotes) => {
        setNotes(fetchedNotes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function addNote (event) {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    };

    notesService
      .create(noteObject)
      .then((addedNote) => {
        setNotes(notes.concat(addedNote));
        setNewNote('');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function toggleImportance(id) {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    notesService
      .update(id, changedNote)
      .then((updNote) => {
        const updatedNotes = notes.map((note) => (note.id === id) ? updNote : note);
        setNotes(updatedNotes);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => <Note key={note.id} note={note} toggleImportance={() => toggleImportance(note.id)} />)}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={({ target }) => setNewNote(target.value)}/>
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
}

export default App;
