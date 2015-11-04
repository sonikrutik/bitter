/*eslint no-use-before-define: [2, "nofunc"]*/

import React from 'react';
import ReactDOM from 'react-dom';

const MAX_MESSAGE_LENGTH = 140;

/*******************************************************************************
 * My beautiful app:
 ******************************************************************************/

class Composer extends React.Component {
  get messageLength() {
    return this.props.message.length;
  }

  get empty() {
    return this.props.message.length === 0;
  }

  get tooLong() {
    return this.messageLength > MAX_MESSAGE_LENGTH;
  }

  get submitDisabled() {
    return this.empty || this.tooLong;
  }

  render() {
    return (
      <form method="POST" action="#" onSubmit={postMessage}>
        <MesssageTextArea
          value={this.props.message}
          valid={!this.tooLong}
          onChange={evt => changeMessage(evt.target.value)} />
        <SubmitButton disabled={this.submitDisabled}> Post </SubmitButton>
        <MessageCounter messageLength={this.messageLength} />
      </form>
    );
  }
}

class MessageCounter extends React.Component {
  get remaining() {
    return MAX_MESSAGE_LENGTH - this.props.messageLength;
  }

  get classNames() {
    if (this.remaining <= 0) {
      return 'counter counter-invalid';
    } else if (this.remaining <= 30) {
      return 'counter counter-warning';
    } else {
      return 'counter';
    }
  }

  render() {
    return (
      <span className={this.classNames}>{this.remaining}</span>
    );
  }
}

/* Bootstrap-ified components. */

const SubmitButton = ({children, disabled}) => (
  <button disabled={disabled} className="btn btn-primary" type="submit">
    {children}
  </button>
);

const MesssageTextArea = (props) => {
  const className = "form-group" + (props.valid ? '' : ' has-error');
  return (
    <div className={className}>
      <textarea className='form-control input-lg' rows={3} {...props} />
    </div>
  );
};

/* Weird global stuff; pretend it doesn't exist. */

let currentMessage = '';
const messages = [];

function changeMessage(text) {
  currentMessage = text;
  rerender();
}

function postMessage(event) {
  event.preventDefault();

  messages.push(currentMessage);
  currentMessage = '';
  rerender();
}

function rerender() {
  const container = document.getElementById('composer');
  ReactDOM.render(
    <Composer message={currentMessage} />,
    container
  );
}

/* Register initial render. */
document.addEventListener("DOMContentLoaded", rerender);
