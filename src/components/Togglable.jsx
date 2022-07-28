import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

function TogglableFunction({ children, buttonLabel }, refs) {
  const [visible, setVisible] = useState(false);

  function toggleVisibility() {
    setVisible(!visible);
  }

  useImperativeHandle(refs, () => ({
    toggleVisibility,
  }));

  function showWhenVisible() {
    return (
      <div className="togglableConent">
        {children}
        <button type="button" onClick={toggleVisibility}>
          cancel
        </button>
      </div>
    );
  }

  function hideWhenVisible() {
    return (
      <button type="button" onClick={toggleVisibility}>
        {buttonLabel}
      </button>
    );
  }

  return <div>{visible ? showWhenVisible() : hideWhenVisible()}</div>;
}

const Togglable = forwardRef(TogglableFunction);

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
