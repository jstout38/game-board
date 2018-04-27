import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormGroup, FormControl, HelpBlock, ControlLabel, Button, Row, Col } from 'react-bootstrap';
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
        <button className="cat-square" onClick={() => this.props.onClick()}>
          {this.props.value}
        </button>
      );
    }
}

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
      <Square value={"$" + String(i.value)} onClick={() => this.renderQuestion(i.question, qNo)}/>
    );
    }
  }

  renderCategorySquare(i) {
    return (
      <CategorySquare value={i} onClick={() => {}}/>
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
      "questions": {
        "100": this.state.q1,
        "200": this.state.q2,
        "300": this.state.q3,
        "400": this.state.q4,
        "500": this.state.q5
      }
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
              "question": category.questions[String((j+1) * 100)],
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
        <button class="btn btn-warning logout-button" onClick={this.handleLogout}>Log Out</button></span>
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
      confirm: "",
      checkboxes: {}
    } 
    this.handleClick = this.handleClick.bind(this);   
    this.handleCreate = this.handleCreate.bind(this);
    this.closeGame = this.closeGame.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    if(this.props.clearboard) {
      this.setState({currentGame: null});
    }
    if (Auth.isUserAuthenticated()) {
      fetch('api/users/' + Auth.getUserID())
        .then(res => res.json())
        .then(games => { 
          this.setState({ 
            userGames: games,
            createGame: false,
            checkboxes: {}
          });
          var newCheckboxes = {};
          for (var i = 0; i < games.length; i++) {
            newCheckboxes[String(games[i]._id)] = false;
          }
          this.setState({checkboxes: newCheckboxes});
        });
    } 
    else {
      this.setState({
        createGame: false
      })
    }    
  }

  componentWillReceiveProps() {    
    this.componentDidMount();    
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

  toggle = (id) => (e) => {
    var tempBoxes = this.state.checkboxes;
    tempBoxes[id] = !tempBoxes[id];
    this.setState({checkboxes: tempBoxes});
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

  handleDelete = event => {
    var gamesToDelete = [];
    for (var key in this.state.checkboxes) {
      if (this.state.checkboxes[key]) {
        gamesToDelete.push(key);
      }
    }    
      fetch('api/games', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer  ' + Auth.getToken()
        },
        body: JSON.stringify({
          "_ids": gamesToDelete
        })
    })
    .then(res => (this.componentDidMount()));
  }

  validateUserName() {
    const length = this.state.username.length;
    if (length > 7) return 'success';
    else return 'error';
  }

  validatePassword() {
    const length = this.state.password.length;
    if (length > 7) return 'success';
    else return 'error';
  }

  confirmPassword() {
    if (this.state.password === this.state.confirm) return 'success';
    else return 'error';
  }

  closeGame = () => {
    this.setState({currentGame: null});
  }

  render() {

      if (this.props.registering) {
        return (
          <form onSubmit={this.handleSubmit}>
          
          
          <FormGroup controlId="username" className="registration-formgroup" validationState={this.validateUserName()}>
            <FormControl className="formcontrol" value = {this.state.username} onChange={this.handleChange} type="text" placeholder="Enter User Name"/>
            <FormControl.Feedback />
            <HelpBlock>Username must be at least 8 characters.</HelpBlock>
          </FormGroup>
          <FormGroup className="registration-formgroup" controlId="password" validationState = {this.validatePassword()}>
            <FormControl type="password" className="formcontrol" value= {this.state.password} onChange={this.handleChange}  placeholder = "Enter Password" />
            <FormControl.Feedback />
            <HelpBlock>Password must be at least 8 characters.</HelpBlock>
          </FormGroup>
          <FormGroup className="registration-formgroup" controlId = "confirm" validationState = {this.confirmPassword()}>
            <FormControl type="password" className = "formcontrol" value = {this.state.confirm} onChange={this.handleChange} placeholder = "Confirm Password" />
            <FormControl.Feedback />
            <HelpBlock>Passwords must match.</HelpBlock>
          </FormGroup>
          <Button className="button" className="registration-formgroup" type="submit">Submit</Button>

        </form>
        )
      }
      else if (Auth.isUserAuthenticated() && !this.state.currentGame && !this.state.createGame && this.props.clearboard) {
        var games = [];
        for (var i = 0; i < this.state.userGames.length; i++) {
          var id = this.state.userGames[i]._id;
          
          games.push(<Row>
                      <Col sm={1}>
                        <input type="checkbox" checked = {this.state.checkboxes[id]} onClick={this.toggle(String(id))} />
                      </Col>
                      <Col sm={4}>
                        <button class="btn btn-primary btn-block game-button" key={id} onClick={this.handleClick(id)}>{this.state.userGames[i].name}</button>
                      </Col>
                    </Row>);
        }
        games.push(<Row>
          <Col sm={2} smOffset={1}>
            <button class="btn btn-success" onClick={this.handleClick(-1)}>Create New Game</button>
          </Col>
          <Col sm={2}>
            <button class="btn btn-danger" onClick={this.handleDelete.bind(this)}>Delete Games</button>
          </Col>
          </Row>);

        return games;
      }
      else if (this.state.currentGame && this.props.user) {
        return (
          <div className="board-container">
          <div className="game-board">
            <Board game={this.state.currentGame} />
          </div>
          <div className="control-panel">
            <ControlPanel closeGame = {this.closeGame}/>
          </div>
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
          this.setState({user: res.userID, registering: false});
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
