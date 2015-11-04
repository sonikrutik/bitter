import React from 'react';
import ReactDOM from 'react-dom';

const MAX_MESSAGE_LENGTH = 140;

/* Weird global stuff; pretend it doesn't exist. */

let currentMessage = '';
const messages = [];

function rerender() {
  const container = document.getElementById('composer');
  ReactDOM.render(
    <Composer message={currentMessage} />,
    container
  );
}

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

/*******************************************************************************
 * My beautiful app:
 ******************************************************************************/

class Composer extends React.Component {
  get messageLength() {
    return this.props.message.length;
  }

  get submitDisabled() {
    return this.props.message.length === 0 ||
      this.messageLength > MAX_MESSAGE_LENGTH;
  }

  render() {
    return (
      <form method="POST" action="#" onSubmit={postMessage}>
        <textarea value={this.props.message}
                  onChange={evt => changeMessage(evt.target.value)} />
        <button type="submit" disabled={this.submitDisabled}> Post </button>
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
    } else if (this.remaining < 30) {
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

document.addEventListener("DOMContentLoaded", rerender);
