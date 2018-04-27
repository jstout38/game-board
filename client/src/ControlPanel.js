import React, { Component } from 'react';
import { Row } from 'react-bootstrap';

class ControlPanel extends React.Component {
  constructor(props) {
    
      super(props);
      this.state = {

      }
    
  }
  render() {
    return (
      <Row>
      <button class="btn btn-danger return" onClick = {this.props.closeGame}>Close Game</button>
      <button class="btn btn-success" onClick = {this.props.reload}>Reload</button>
      </Row>
    )
  }
}

export default ControlPanel