import React from 'react';
import { Row, Col } from 'react-bootstrap';

class ControlPanel extends React.Component {
  constructor(props) {
    
      super(props);
      this.state = {

      }
    
  }
  render() {
    return (
      <Col xs={12}>
      <Row className="button-row">
      <button className="btn btn-danger return" onClick = {this.props.closeGame}>Close Game</button>
      </Row>
      <Row className="button-row">
      <button className="btn btn-success reload" onClick = {this.props.reload}>Reload</button>
      </Row>
      </Col>
    )
  }
}

export default ControlPanel