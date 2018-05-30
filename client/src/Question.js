import React from 'react';

class Question extends React.Component {
  render() {
    return (
      <div className="question">
        <p className="questionText">{this.props.question}</p>
        <button className="btn btn-danger btn-lg" onClick={() => this.props.onClick()}>Close</button>
      </div>
      );
  }
}

export default Question;