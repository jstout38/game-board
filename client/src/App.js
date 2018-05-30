import React, { Component } from 'react';
import './App.css';
import { withRouter } from 'react-router';
import Auth from './Auth';
import CurrentGame from './CurrentGame';
import Header from './Header';
import Game from './Game';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      token: null,
      user: null,
      username: null,
      clearboard: true,
      registering: false
    }
    this.refresh = this.refresh.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    if (Auth.isUserAuthenticated()) {
      this.state.user = Auth.getUserID();
    }
  }

  refresh = () => {
    this.forceUpdate();
  }

  loadRegistration = () => {
    this.setState({registering: true});
  }

  register = (username, password) => {
    fetch('api/users/signup', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        "username": username,
        "password": password
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        this.login(username, password);
        this.setState({registering: false});
      }
      else {
        if (res.err.name === "UserExistsError") {
          alert("Username already exists, try again!");
        }
        else {
          alert("Error! Try again!");
        }
      }
    })
  }

  login = (username, password) => {
      fetch('api/users/login', {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          "username": username,
          "password": password
        }),
      })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          Auth.authenticateUser(res.token, res.username, res.userID);
          this.setState({user: res.userID, registering: false});
        }
        else{

        }
      })      
  }

  logout = () => {
    Auth.deauthenticateUser();
    CurrentGame.quitGame();
    this.setState({user: null, username: null, clearboard: true}, function () {this.forceUpdate()});
  }

  render() {

    return (
      <div>
        <div className="game-header">
          <Header refresh = {this.refresh} login = {this.login} logout = {this.logout} loadRegistration = {this.loadRegistration} />
        </div>
        <div className="App">
          <Game user = {this.state.user} clearboard = {this.state.clearboard} registering = {this.state.registering} register = {this.register} />
        </div>
      </div>
    );
  }
}

export default withRouter(App);
