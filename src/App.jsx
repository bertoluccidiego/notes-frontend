import { useState, useEffect, useRef } from 'react';

import Note from './components/Note';
import Notification from './components/Notification';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import NoteForm from './components/NoteForm';

import notesService from './services/notes';
import loginService from './services/login';

function App() {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const noteFormRef = useRef();

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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      setUser(loggedUser);
      notesService.setToken(loggedUser.token);
    }
  }, []);

  function toggleImportance(id) {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    notesService
      .update(id, changedNote)
      .then((updNote) => {
        const updatedNotes = notes.map((n) => (n.id === id ? updNote : n));
        setNotes(updatedNotes);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      notesService.setToken(user.token);
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user));
      setUsername('');
      setPassword('');
    } catch (error) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => setErrorMessage(null), 5000);
      console.log(error);
    }
  }

  function handleLogout() {
    notesService.setToken(null);
    setUser(null);
    window.localStorage.removeItem('loggedNoteAppUser');
  }

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  function loginForm() {
    return (
      <Togglable buttonLabel="login">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    );
  }

  function noteForm() {
    return (
      <Togglable buttonLabel="new note" ref={noteFormRef}>
        <NoteForm notes={notes} setNotes={setNotes} noteFormRef={noteFormRef} />
      </Togglable>
    );
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>logout</button>
          {noteForm()}
        </div>
      )}
      <div>
        <button type="button" onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportance(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  );
}

export default App;
