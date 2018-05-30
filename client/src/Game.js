import React from 'react';
import Auth from './Auth';
import { FormGroup, FormControl, HelpBlock, Button, Row, Col } from 'react-bootstrap';
import Board from './Board';
import Creator from './Creator';
import CurrentGame from './CurrentGame';
import ControlPanel from './ControlPanel';
import Creator_image from './Creator.png';
import board_image from './Board.png';

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
      checkboxes: {},
      newGame: false,
      readyToSubmit: false,
      registration_username: "",
      registration_password: ""
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

  componentWillReceiveProps(newProps) {    
    this.componentDidMount(); 
    if (newProps.registering) {
      this.setState({"registration_username": "", "registration_password": ""})
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
    this.props.register(this.state.registration_username, this.state.registration_password);
    this.setState({
      registration_username: "",
      registration_password: "",
      confirm: ""
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  loadSampleGame = event => {
    CurrentGame.setGame("5b021835cf8a4a29d83de681");
    this.setState({"currentGame": "5b021835cf8a4a29d83de681", "newGame": true}, function () {this.forceUpdate()});
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
    const length = this.state.registration_username.length;
    if (length > 7) return 'success'
    else if (length === 0) return null
    else return 'error';
  }

  validatePassword() {
    const length = this.state.registration_password.length;
    if (length > 7) return 'success'
    else if (length === 0) return null
    else return 'error';
  }

  confirmPassword() {
    const length = this.state.confirm.length
    if (this.state.registration_password === this.state.confirm && length > 7) return 'success'
    else if (length === 0) return null
    else return 'error';
  }

  closeGame = () => {
    this.setState({currentGame: null});
  }

  reload = () => {
    this.setState({newGame: true});
  }

  closed = () => {
    this.setState({createGame: false});
  }

  created = () => {
    this.setState({createGame: false});
    this.componentDidMount();
  }

  render() {

      if (this.props.registering) {
        return (
          <form onSubmit={this.handleSubmit}>
          
          
          <FormGroup controlId="registration_username" className="registration-formgroup" validationState={this.validateUserName()}>
            <FormControl className="formcontrol" value = {this.state.registration_username} onChange={this.handleChange} type="text" placeholder="Enter User Name"/>
            <FormControl.Feedback />
            <HelpBlock className="help">Username must be at least 8 characters.</HelpBlock>
          </FormGroup>
          <FormGroup className="registration-formgroup" controlId="registration_password" validationState = {this.validatePassword()}>
            <FormControl type="password" className="formcontrol" value= {this.state.registration_password} onChange={this.handleChange}  placeholder = "Enter Password" />
            <FormControl.Feedback />
            <HelpBlock className="help">Password must be at least 8 characters.</HelpBlock>
          </FormGroup>
          <FormGroup className="registration-formgroup" controlId = "confirm" validationState = {this.confirmPassword()}>
            <FormControl type="password" className = "formcontrol" value = {this.state.confirm} onChange={this.handleChange} placeholder = "Confirm Password" />
            <FormControl.Feedback />
            <HelpBlock className="help">Passwords must match.</HelpBlock>
          </FormGroup>
          <Button className="button button-font registration-formgroup" disabled={this.validateUserName() !== 'success' || this.validatePassword() !== 'success' || this.confirmPassword() !== 'success'} type="submit">Submit</Button>

        </form>
        )
      }
      else if (Auth.isUserAuthenticated() && !this.state.currentGame && !this.state.createGame && this.props.clearboard) {
        var games = [];
        for (var i = 0; i < this.state.userGames.length; i++) {
          var id = this.state.userGames[i]._id;
          console.log(this.state.checkboxes)
          games.push(<Row key = {i}>
                      <Col sm={1}>
                        <input type="checkbox" checked = {this.state.checkboxes[id] || false} onClick={this.toggle(String(id))} />
                      </Col>
                      <Col sm={4}>
                        <button className="btn btn-primary btn-block game-button" key={id} onClick={this.handleClick(id)}>{this.state.userGames[i].name}</button>
                      </Col>
                    </Row>);
        }
        games.push(<Row key = {"buttons"}>
          <Col sm={2} smOffset={1}>
            <button className="btn btn-success button-font" onClick={this.handleClick(-1)}>Create New Game</button>
          </Col>
          <Col sm={2}>
            <button className="btn btn-danger button-font" onClick={this.handleDelete.bind(this)}>Delete Games</button>
          </Col>
          </Row>);

        return games;
      }
      else if (this.state.currentGame) {
        return (
          <div className="board-container">
          <div className="game-board">
            <Board game={this.state.currentGame} newgame={this.state.newGame}/>
          </div>
          <div className="control-panel">
            <ControlPanel closeGame = {this.closeGame} reload = {this.reload}/>
          </div>
          </div>
        );
      }
      else if (Auth.isUserAuthenticated() && this.state.createGame) {
        return (
          <div className="game-creator">
            <Creator created={this.created} closed={this.closed}/>
          </div>
        )
      }
      else {
        return (
          <div>
          <Row>
          <h1>Welcome to the Quiz Board App!</h1>
          </Row>
          <Row>
          <h2>Create your own customized quiz boards!</h2>
          </Row>
          <Row sm={12}>
          <Col sm={5} smOffset={1}>
          <img alt="Board Creator" src={Creator_image}></img>
          </Col>
          <Col sm={4}>
          <img alt="Sample Board" src={board_image}></img>
          </Col>
          </Row>
          <Col sm={4} smOffset={4}>
          <button className="btn btn-primary btn-block btn-lg game-button" onClick={this.loadSampleGame}>See a sample game!</button>
          </Col>
          </div>
        );
      }
  }
  
}

export default Game;