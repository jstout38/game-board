import React from 'react';
import Auth from './Auth';
import { Form, FormGroup, FormControl, HelpBlock, ControlLabel, Button, Row, Col } from 'react-bootstrap';

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

  handleRegister = event => {
    this.setState({"username": "", "password": ""});
    this.props.loadRegistration();
  }

  render() {
    if (!Auth.isUserAuthenticated()) {
      return (

        <Form inline className="login-form" onSubmit={this.handleSubmit}>
          
          <FormGroup controlId="username" className="formgroup">
            <FormControl className="formcontrol" value = {this.state.username} onChange={this.handleChange} type="text" placeholder="Enter User Name"/>
          </FormGroup>
          
          
          <FormGroup className="formgroup" controlId="password" >
            <FormControl type="password" className="formcontrol" value= {this.state.password} onChange={this.handleChange}  placeholder = "Enter Password" />
          </FormGroup>
          
          <button className="btn btn-success login-button" type="submit">Submit</button>
          <button className="btn btn-info register-button" onClick={this.handleRegister}>Register</button>
          
        </Form>
      ) 
    }
    else {
      return (
        <span className="login-notification">Logged In as {Auth.getUserName()}
        <button className="btn btn-warning logout-button" onClick={this.handleLogout}>Log Out</button></span>
      )
    }
  }
}

export default Header;