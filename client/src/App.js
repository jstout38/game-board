import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Auth from './Auth';

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}        
      </button>
    );
  }
}

class CategorySquare extends React.Component {
    render() {
      return (
        <button className="square">
          {this.props.value}
        </button>
      );
    }
}

class Question extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.question}</p>
        <button onClick={() => this.props.onClick()}>Return</button>
      </div>
      );
  }
}

class Board extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      game: [],
      questionMode: false,
      currentQuestion: null,
      completed: Array(30).fill(false)
    }
  }

  componentDidMount() {
    fetch('api/games/5ac9337d686a3c2ccc2c1253/')
      .then(res => res.json())
      .then(game => this.setState({ game }));
  }

  returnToBoard() {
    this.setState({
      questionMode: false,
      currentQuestion: null
    })
  }

  renderQuestion(text, qNo) {
    //this.currentQuestion = this.state.game.game.categories[0].questions[0];
    var tempCompleted = this.state.completed.slice();
    tempCompleted[qNo] = true;
      
    this.setState({
      questionMode: true,
      currentQuestion: text,
      completed: tempCompleted
    });    
  }

  renderSquare(i, qNo) {
    if (this.state.completed[qNo]) {
      return (
        <Square value={<span className="placeholder">blank</span>} onClick={() =>{}}/>
        );
    }
    else {
      
    return(
      <Square value={i.value} onClick={() => this.renderQuestion(i.question, qNo)}/>
    );
    }
  }

  renderCategorySquare(i) {
    return (
      <Square value={i} onClick={() => {}}/>
    );
  }


  render() {
    const status = 'Next player: X';
    if (this.state.game.categories && !this.state.questionMode) {
    return (
      <div>
        <div className="board-row">
          {this.renderCategorySquare(this.state.game.categories[0].name)}
          {this.renderCategorySquare(this.state.game.categories[1].name)}
          {this.renderCategorySquare(this.state.game.categories[2].name)}
          {this.renderCategorySquare(this.state.game.categories[3].name)}
          {this.renderCategorySquare(this.state.game.categories[4].name)}
          {this.renderCategorySquare(this.state.game.categories[5].name)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.state.game.categories[0].questions[0], 1)}
          {this.renderSquare(this.state.game.categories[1].questions[0], 2)}
          {this.renderSquare(this.state.game.categories[2].questions[0], 3)}
          {this.renderSquare(this.state.game.categories[3].questions[0], 4)}
          {this.renderSquare(this.state.game.categories[4].questions[0], 5)}
          {this.renderSquare(this.state.game.categories[5].questions[0], 6)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.state.game.categories[0].questions[1], 7)}
          {this.renderSquare(this.state.game.categories[1].questions[1], 8)}
          {this.renderSquare(this.state.game.categories[2].questions[1], 9)}
          {this.renderSquare(this.state.game.categories[3].questions[1], 10)}
          {this.renderSquare(this.state.game.categories[4].questions[1], 11)}
          {this.renderSquare(this.state.game.categories[5].questions[1], 12)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.state.game.categories[0].questions[2], 13)}
          {this.renderSquare(this.state.game.categories[1].questions[2], 14)}
          {this.renderSquare(this.state.game.categories[2].questions[2], 15)}
          {this.renderSquare(this.state.game.categories[3].questions[2], 16)}
          {this.renderSquare(this.state.game.categories[4].questions[2], 17)}
          {this.renderSquare(this.state.game.categories[5].questions[2], 18)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.state.game.categories[0].questions[3], 19)}
          {this.renderSquare(this.state.game.categories[1].questions[3], 20)}
          {this.renderSquare(this.state.game.categories[2].questions[3], 21)}
          {this.renderSquare(this.state.game.categories[3].questions[3], 22)}
          {this.renderSquare(this.state.game.categories[4].questions[3], 23)}
          {this.renderSquare(this.state.game.categories[5].questions[3], 24)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.state.game.categories[0].questions[4], 25)}
          {this.renderSquare(this.state.game.categories[1].questions[4], 26)}
          {this.renderSquare(this.state.game.categories[2].questions[4], 27)}
          {this.renderSquare(this.state.game.categories[3].questions[4], 28)}
          {this.renderSquare(this.state.game.categories[4].questions[4], 29)}
          {this.renderSquare(this.state.game.categories[5].questions[4], 30)}
        </div>
      </div>
    );
  }
  else if (this.state.questionMode) {
    return(<Question question={this.state.currentQuestion} onClick = {() => this.returnToBoard()}/>);
  }
  else {
    return <p></p>;
  }
  }
}

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
  }

  handleLogout = event => {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    if (!Auth.isUserAuthenticated()) {
      return (
        <form onSubmit={this.handleSubmit}>
          <Button className="button" type="submit">Submit</Button>
          <FormGroup className="formgroup" controlId="password" >
            <FormControl type="password" value= {this.state.password} onChange={this.handleChange}  placeholder = "Enter Password" />
          </FormGroup>
          <FormGroup controlId="username" className="formgroup">
            <FormControl className="formcontrol" value = {this.state.username} onChange={this.handleChange} type="text" placeholder="Enter User Name"/>
          </FormGroup>
        </form>
      ) 
    }
    else {
      return (
        <p>Logged In as {Auth.getUserName()}
        <button onClick={this.handleLogout}>Log Out</button></p>
      )
    }
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      currentGame: null,
      userGames: [],
      loading: true,
    }    
  }


  componentWillReceiveProps() {
    console.log(this.props.user);
    if (Auth.isUserAuthenticated()) {
      fetch('api/users/' + Auth.getUserID())
        .then(res => res.json())
        .then(games => { 
          this.setState({ 
            userGames: games,    
            loading: false        
          });
        });
    }    
  }

  render() {

      if (Auth.isUserAuthenticated() && !this.state.loading) {
        var games = [];
        for (var i = 0; i < this.state.userGames.length; i++) {
          games.push(<p key={this.state.userGames[i]}>{this.state.userGames[i].name}</p>);
        }
        return games;
      }
      else {
        return (
          <div className="game-board">
            <Board />
          </div>
          
        );
      }
  }
  
}

// ========================================

//ReactDOM.render(
//  <Game />,
//  document.getElementById('root')
//);
class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      token: null,
      user: null,
      username: null
    }
    this.refresh = this.refresh.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    if (Auth.isUserAuthenticated()) {
      this.state.user = Auth.getUserID();
    }
  }

  refresh = () => {
    this.forceUpdate();
  }

  login = (username, password) => {
      fetch('api/users/login', {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3001',
          'Origin': 'http://localhost:3001'
        }),
        body: JSON.stringify({
          "username": username,
          "password": password,
        }),
      })
      .then(res => res.json())
      .then(res => {
        Auth.authenticateUser(res.token, res.username, res.userID);
        this.setState({user: res.userID});
      })      
  }

  logout = () => {
    Auth.deauthenticateUser();
    this.setState({user: null});
  }

  render() {

    return (
      <div>
        <div className="game-header">
          <Header refresh = {this.refresh} login = {this.login} logout = {this.logout} />
        </div>
        <div className="App">
          <Game user = {Auth.getUserID()}/>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
