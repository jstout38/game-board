import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Auth from './Auth';
import CurrentGame from './CurrentGame';

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

  componentWillReceiveProps() {
    console.log(this.props.game);
    fetch('api/games/' + CurrentGame.getGame())
      .then(res => res.json())
      .then(game => {this.setState({ game: game, questionMode: false }); CurrentGame.setGameData(game)});
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
    return <p>Test</p>;
  }
  }
}

class Creator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finished_cats: [],
      category_title: "",
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      gameID: null,
      gameName: "",
      cats_to_push: []
    }
  }

    createGame = event => {
    event.preventDefault();
    fetch('api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer  ' + Auth.getToken()
      },
      body: JSON.stringify({
        "name": this.state.gameName
      })
    })
    .then(res => res.json())
    .then(res => {
      console.log(this.state.cats_to_push);
      {this.state.gameID = res._id}        
        fetch('api/games/' + res._id + '/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Auth.getToken()
          },
          body: JSON.stringify({
            "_id": this.state.cats_to_push          
          })
        })
      
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    var category = {
      "name": this.state.category_title,
      "questions": [
        this.state.q1,
        this.state.q2,
        this.state.q3,
        this.state.q4,
        this.state.q5
      ]
    }
    fetch('api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Auth.getToken()
        },
        body: JSON.stringify({
          "name": category.name
        })
      })
      .then(res => res.json())
      .then(res => {
        var _id = res._id;
        this.state.cats_to_push.push(_id);
        for (var j = 0; j < 5; j++) {
          fetch('api/categories/' + _id + '/questions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify({
              "question": category.questions[j],
              "value": ((j + 1) * 100)
            })
          })
        }
        

      })        
    this.setState({
      category_title: "",
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: ""
    })
  }

  render() {
    return(
      <div>
      <form onSubmit={this.handleSubmit}>
        <FormGroup className="formgroup2" controlId="category_title">
          <FormControl className="formcontrol" type="text" value= {this.state.category_title} onChange={this.handleChange} placeholder = "Enter Category Title" />
        </FormGroup>
        <FormGroup className="formgroup2" controlId="q1">
          <FormControl className="formcontrol" type="text" value = {this.state.q1} onChange={this.handleChange} placeholder = "Question 1" />
        </FormGroup>
        <FormGroup className="formgroup2" controlId="q2">
          <FormControl className="formcontrol" type="text" value = {this.state.q2} onChange={this.handleChange} placeholder = "Question 2" />
        </FormGroup>
        <FormGroup className="formgroup2" controlId="q3">
          <FormControl className="formcontrol" type="text" value = {this.state.q3} onChange={this.handleChange} placeholder = "Question 3" />
        </FormGroup>
        <FormGroup className="formgroup2" controlId="q4">
          <FormControl className="formcontrol" type="text" value = {this.state.q4} onChange={this.handleChange} placeholder = "Question 4" />
        </FormGroup>
        <FormGroup className="formgroup2" controlId="q5">
          <FormControl className="formcontrol" type="text" value = {this.state.q5} onChange={this.handleChange} placeholder = "Question 5" />
        </FormGroup>
        <Button className="button" type="submit">Submit</Button>
      </form>
      <p>{this.state.finished_cats.length}</p>
      <form onSubmit={this.createGame}>
      <FormGroup className="formgroup2" controlId="gameName">
        <FormControl className="formcontrol" type="text" value = {this.state.gameName} onChange={this.handleChange} placeholder = "Game Name" />
      </FormGroup>
      <Button className="button" type="submit">Create Game</Button> 
      </form>
      </div>

    )
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
        <button onClick={this.handleLogout}>Log Out</button></span>
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
      createGame: false,
      username: "",
      password: "",
      confirm: ""
    } 
    this.handleClick = this.handleClick.bind(this);   
    this.handleCreate = this.handleCreate.bind(this);
  }

  componentWillReceiveProps() {    
    if(this.props.clearboard) {
      this.setState({currentGame: null});
    }
    if (Auth.isUserAuthenticated()) {
      fetch('api/users/' + Auth.getUserID())
        .then(res => res.json())
        .then(games => { 
          this.setState({ 
            userGames: games,
            createGame: false
          });
        });
    } 
    else {
      this.setState({
        createGame: false
      })
    }    
  } 

  handleClick = (gameID) => (e) => {
    if (gameID === -1) {
      this.setState({createGame: true});
    }
    else {    
      CurrentGame.setGame(gameID);
      this.setState({currentGame: gameID}, function () {this.forceUpdate()});
    }
  }

  handleCreate = () => (e) => {
    e.preventDefault();
    this.setState({createGame: true});
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.register(this.state.username, this.state.password);
    this.setState({
      username: "",
      password: "",
      confirm: ""
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  render() {

      if (this.props.registering) {
        return (
          <form onSubmit={this.handleSubmit}>
          
          
          <FormGroup controlId="username" className="registration-formgroup">
            <FormControl className="formcontrol" value = {this.state.username} onChange={this.handleChange} type="text" placeholder="Enter User Name"/>
          </FormGroup>
          <FormGroup className="registration-formgroup" controlId="password" >
            <FormControl type="password" className="formcontrol" value= {this.state.password} onChange={this.handleChange}  placeholder = "Enter Password" />
          </FormGroup>
          <FormGroup className="registration-formgroup" controlId = "confirm">
            <FormControl type="password" className = "formcontrol" value = {this.state.confirm} onChange={this.handleChange} placeholder = "Confirm Password" />
          </FormGroup>
          <Button className="button" className="registration-formgroup" type="submit">Submit</Button>

        </form>
        )
      }
      else if (Auth.isUserAuthenticated() && !this.state.currentGame && !this.state.createGame && this.props.clearboard) {
        var games = [];
        for (var i = 0; i < this.state.userGames.length; i++) {
          var id = this.state.userGames[i]._id;
          games.push(<button key={id} onClick={this.handleClick(id)}>{this.state.userGames[i].name}</button>);
        }
        games.push(<button onClick={this.handleClick(-1)}>Create New Game</button>)
        return games;
      }
      else if (this.state.currentGame && this.props.user) {
        return (
          <div className="game-board">
            <Board game={this.state.currentGame} />
          </div>
        );
      }
      else if (Auth.isUserAuthenticated() && this.state.createGame) {
        return (
          <div className="game-creator">
            <Creator />
          </div>
        )
      }
      else {
        return (
          <p>Log in!</p>
          
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
      username: null,
      clearboard: false,
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
        this.setState({registering: false})
      }
      else {

      }
    })
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
        if (res.success) {
          Auth.authenticateUser(res.token, res.username, res.userID);
          this.setState({user: res.userID});
        }
        else{

        }
      })      
  }

  logout = () => {
    Auth.deauthenticateUser();
    CurrentGame.quitGame();
    this.setState({user: null, clearboard: true}, function () {this.forceUpdate});
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
