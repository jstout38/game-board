import React from 'react';
import Auth from './Auth';
import { FormGroup, FormControl, HelpBlock, ControlLabel, Button, Row, Col } from 'react-bootstrap';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.login(this.state.username, this.state.password);
    this.setState({
      username: "",
      password: ""
    })
  }

  handleLogout = event => {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    if (!Auth.isUserAuthenticated()) {
      return (

        <form onSubmit={this.handleSubmit}>
          <Button className="button" onClick={this.props.loadRegistration}>Register</Button>
          <Button className="button" type="submit">Submit</Button>
          <FormGroup className="formgroup" controlId="password" >
            <FormControl type="password" className="formcontrol" value= {this.state.password} onChange={this.handleChange}  placeholder = "Enter Password" />
          </FormGroup>
          <FormGroup controlId="username" className="formgroup">
            <FormControl className="formcontrol" value = {this.state.username} onChange={this.handleChange} type="text" placeholder="Enter User Name"/>
          </FormGroup>

        </form>
      ) 
    }
    else {
      return (
        <span>Logged In as {Auth.getUserName()}
        <button className="btn btn-warning logout-button" onClick={this.handleLogout}>Log Out</button></span>
      )
    }
  }
}

export default Header;