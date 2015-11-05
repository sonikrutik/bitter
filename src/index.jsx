/*eslint-env es6*/
/*eslint no-use-before-define: [2, "nofunc"]*/

import React from 'react';
import ReactDOM from 'react-dom';

const MAX_MESSAGE_LENGTH = 140;

/*******************************************************************************
 * My beautiful app:
 ******************************************************************************/

class MessageComposer extends React.Component {
  get empty() {
    return this.props.message.trim() === '';
  }

  get tooLong() {
    return this.messageLength > MAX_MESSAGE_LENGTH;
  }

  get submitDisabled() {
    return this.empty || this.tooLong;
  }

  get messageLength() {
    return this.props.message.length;
  }

  render() {
    return (
      <form method="POST" action="#" onSubmit={postMessage}>
        <ComposeTextArea
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

  get className() {
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
      <span className={this.className}>{this.remaining}</span>
    );
  }
}

/* Bootstrap-ified components. */

const SubmitButton = ({children, disabled}) => (
  <button disabled={disabled} className="btn btn-primary" type="submit">
    {children}
  </button>
);

const ComposeTextArea = (props) => {
  const className = "form-group" + (props.valid ? '' : ' has-error');
  return (
    <div className={className}>
      <textarea className='form-control input-lg' rows={3} {...props} />
    </div>
  );
};

const MessageList = ({messages}) => (
  <section className="message-list panel panel-default">
    <div className="panel-body">
      {messages.map((props, i) => <Message key={i} {...props} />)}
    </div>
  </section>
);

const Message = ({text, name, avatarURL}) => (
  <div className="media">
    <div className="media-left">
      <a href="#">
        <img className="media-object message-avatar" src={avatarURL} />
      </a>
    </div>
    <div className="media-body">
      <h4 className="media-heading">{name}</h4>
      <p>{text}</p>
    </div>
  </div>
);

/* Weird global stuff; pretend it doesn't exist. */

let currentMessage = '';
const messages = [
  {
    text: 'whats a monad lol',
    name: 'Eddie Antonio Santos',
    avatarURL: 'https://pbs.twimg.com/profile_images/591750801590091776/NdtsEAu7.jpg'
  }
];

function changeMessage(text) {
  currentMessage = text;
  rerender();
}

function postMessage(event) {
  event.preventDefault();

  messages.push({
    text: currentMessage,
    name: 'Eddie Antonio Santos',
    avatarURL: 'https://pbs.twimg.com/profile_images/591750801590091776/NdtsEAu7.jpg'
  });
  currentMessage = '';
  rerender();
}

function rerender() {
  const container = document.getElementById('composer');
  ReactDOM.render(
    <div>
      <MessageComposer message={currentMessage} />
      <MessageList messages={messages} />
    </div>,
    container
  );
}

/* Register initial render. */
document.addEventListener("DOMContentLoaded", rerender);
