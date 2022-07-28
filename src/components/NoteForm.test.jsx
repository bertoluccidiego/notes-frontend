import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

import NoteForm from './NoteForm';

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const setNotes = jest.fn();
  const user = userEvent.setup();

  render(<NoteForm setNotes={setNotes} />);

  const input = screen.getByRole('textbox');
  const sendButton = screen.getByText('save');

  await user.type(input, 'testing a form...');
  await user.click(sendButton);

  expect(setNotes.mock.calls).toHaveLength(1);
  expect(setNotes.mock.calls[0][0].content).toBe('testing a form');
});
