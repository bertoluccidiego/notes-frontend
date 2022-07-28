import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Togglable from './Togglable';

describe('<Togglable />', () => {
  let container;

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv">togglable content</div>
      </Togglable>
    ).container;
  });

  test('at start the children are not displayed', () => {
    const button = container.querySelector('button');

    expect(button).toHaveTextContent('show...');
  });

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup();
    let button = container.querySelector('button');
    await user.click(button);

    button = container.querySelector('button');
    expect(button).toHaveTextContent('cancel');
  });

  test('toggled content can be closed', async () => {
    const user = userEvent.setup();
    let button = container.querySelector('button');
    await user.click(button);

    button = container.querySelector('button');
    await user.click(button);

    button = container.querySelector('button');
    expect(button).toHaveTextContent('show...');
  });
});
