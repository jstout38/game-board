import React from 'react';
import Auth from './Auth';
import { FormGroup, FormControl, HelpBlock, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import Board from './Board';
import Creator from './Creator';
import CurrentGame from './CurrentGame';
import ControlPanel from './ControlPanel';

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
      readyToSubmit: false
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
    if (length > 7) return 'success'
    else if (length === 0) return null
    else return 'error';
  }

  validatePassword() {
    const length = this.state.password.length;
    if (length > 7) return 'success'
    else if (length === 0) return null
    else return 'error';
  }

  confirmPassword() {
    const length = this.state.confirm.length
    if (this.state.password === this.state.confirm && length > 7) return 'success'
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
          
          
          <FormGroup controlId="username" className="registration-formgroup" validationState={this.validateUserName()}>
            <FormControl className="formcontrol" value = {this.state.username} onChange={this.handleChange} type="text" placeholder="Enter User Name"/>
            <FormControl.Feedback />
            <HelpBlock className="help">Username must be at least 8 characters.</HelpBlock>
          </FormGroup>
          <FormGroup className="registration-formgroup" controlId="password" validationState = {this.validatePassword()}>
            <FormControl type="password" className="formcontrol" value= {this.state.password} onChange={this.handleChange}  placeholder = "Enter Password" />
            <FormControl.Feedback />
            <HelpBlock className="help">Password must be at least 8 characters.</HelpBlock>
          </FormGroup>
          <FormGroup className="registration-formgroup" controlId = "confirm" validationState = {this.confirmPassword()}>
            <FormControl type="password" className = "formcontrol" value = {this.state.confirm} onChange={this.handleChange} placeholder = "Confirm Password" />
            <FormControl.Feedback />
            <HelpBlock className="help">Passwords must match.</HelpBlock>
          </FormGroup>
          <Button className="button" disabled={this.validateUserName() !== 'success' || this.validatePassword() !== 'success' || this.confirmPassword() !== 'success'} className="registration-formgroup" type="submit">Submit</Button>

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
                        <button className="btn btn-primary btn-block game-button" key={id} onClick={this.handleClick(id)}>{this.state.userGames[i].name}</button>
                      </Col>
                    </Row>);
        }
        games.push(<Row>
          <Col sm={2} smOffset={1}>
            <button className="btn btn-success" onClick={this.handleClick(-1)}>Create New Game</button>
          </Col>
          <Col sm={2}>
            <button className="btn btn-danger" onClick={this.handleDelete.bind(this)}>Delete Games</button>
          </Col>
          </Row>);

        return games;
      }
      else if (this.state.currentGame && this.props.user) {
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
          <p>Log in!</p>
          
        );
      }
  }
  
}

export default Game;