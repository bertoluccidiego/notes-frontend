import { useState, forwardRef, useImperativeHandle } from 'react';

function Togglable({ children, buttonLabel }, refs) {
  const [visible, setVisible] = useState(false);

  function toggleVisibility() {
    setVisible(!visible);
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  function showWhenVisible() {
    return (
      <div>
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    );
  }

  function hideWhenVisible() {
    return <button onClick={toggleVisibility}>{buttonLabel}</button>;
  }

  return <div>{visible ? showWhenVisible() : hideWhenVisible()}</div>;
}

export default forwardRef(Togglable);
