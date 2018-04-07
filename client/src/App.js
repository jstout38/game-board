import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Question extends React.Component {
  render() {
    return (
      <div>
        <p>Question goes here</p>
        <Link to="/">Return to Board</Link>
      </div>
      )
  }
}

class Board extends React.Component {
  
  renderSquare(i) {
    return (
    <Square value={i} onClick={() => this.props.history.push('/question')}/>
    );
  }

  renderQuestion() {
    console.log("yes");
    return <Redirect to="/question"/>
  }

  render() {
    console.log(this.props.game.game.categories)
    const status = 'Next player: X';
    if (this.props.game.game.categories) {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(this.props.game.game.categories[0].name)}
          {this.renderSquare(this.props.game.game.categories[1].name)}
          {this.renderSquare(this.props.game.game.categories[2].name)}
          {this.renderSquare(this.props.game.game.categories[3].name)}
          {this.renderSquare(this.props.game.game.categories[4].name)}
          {this.renderSquare(this.props.game.game.categories[5].name)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare(10)}
          {this.renderSquare(11)}
        </div>
        <div className="board-row">
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
          {this.renderSquare(15)}
          {this.renderSquare(16)}
          {this.renderSquare(17)}
        </div>
        <div className="board-row">
          {this.renderSquare(18)}
          {this.renderSquare(19)}
          {this.renderSquare(20)}
          {this.renderSquare(21)}
          {this.renderSquare(22)}
          {this.renderSquare(23)}
        </div>
        <div className="board-row">
          {this.renderSquare(24)}
          {this.renderSquare(25)}
          {this.renderSquare(26)}
          {this.renderSquare(27)}
          {this.renderSquare(28)}
          {this.renderSquare(29)}
        </div>
        <div className="board-row">
          {this.renderSquare(30)}
          {this.renderSquare(31)}
          {this.renderSquare(32)}
          {this.renderSquare(33)}
          {this.renderSquare(34)}
          {this.renderSquare(35)}
        </div>
      </div>
    );
  }
  else {
    return <p></p>;
  }
  }
}

class Game extends React.Component {

  render() {

    return (
      <div className="game-board">
        <Switch>
          <Route exact path='/' render={(props) => <Board game={this.props.game}/>}/>
          <Route path='/question' component={Question} />
        </Switch>
      </div>
      
    );
  }
}

// ========================================

//ReactDOM.render(
//  <Game />,
//  document.getElementById('root')
//);
class App extends Component {
  
  state = {game: []}

  componentDidMount() {
    fetch('api/games/5ac9337d686a3c2ccc2c1253/')
      .then(res => res.json())
      .then(game => this.setState({ game }));
  }


  render() {

    return (
      <div>
        <div className="game-header">
        </div>
        <div className="App">
          <Game game={this.state}/>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
