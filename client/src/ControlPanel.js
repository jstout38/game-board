import React, { Component } from 'react';

class ControlPanel extends React.Component {
  constructor(props) {
    
      super(props);
      this.state = {

      }
    
  }

  render() {
    return (
      <button class="btn btn-danger return" onClick = {this.props.closeGame}>Close Game</button>
    )
  }
}

export default ControlPanel