import React from 'react';
import Square from './Square';
import CategorySquare from './CategorySquare';
import Question from './Question';
import CurrentGame from './CurrentGame';

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

  componentWillReceiveProps(newProps) {
    if(newProps.newgame) {
      var complete = Array(30).fill(false);
      this.setState({completed: complete});
    }
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

export default Board;