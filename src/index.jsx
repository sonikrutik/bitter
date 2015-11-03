const React = require('react');
const ReactDOM = require('react-dom');

const MAX_MESSAGE_LENGTH = 140;


class Composer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    };
  }

  get messageLength() {
    return this.state.message.length;
  }

  handleChange(event) {
    this.setState({
      message: event.target.value
    });
  }

  render() {
    return (
      <form method="POST" action="#">
        <textarea value={this.state.message}
                  onChange={this.handleChange.bind(this)} />
        <button disabled={this.messageLength > MAX_MESSAGE_LENGTH}> Post </button>
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

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('composer');
  ReactDOM.render(
    <Composer />,
    container
  );
});