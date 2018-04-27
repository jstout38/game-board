import React from 'react';

class Question extends React.Component {
  render() {
    return (
      <div className="question">
        <p class="questionText">{this.props.question}</p>
        <button onClick={() => this.props.onClick()}>Return</button>
      </div>
      );
  }
}

export default Question;