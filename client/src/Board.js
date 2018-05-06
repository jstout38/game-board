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

  renderCategorySquare(i, catNo) {
    if (this.state.completed[catNo] && this.state.completed[catNo + 6] && this.state.completed[catNo + 12] && this.state.completed[catNo + 18] && this.state.completed[catNo + 24]) {
      return (
        <CategorySquare value={<span className="placeholder">blank</span>} onClick={() => {}}/>
      )
    }
    else {
      return (
        <CategorySquare value={i} onClick={() => {}}/>
      );
    }
  }


  render() {
    const status = 'Next player: X';
    if (this.state.game.categories && !this.state.questionMode) {
    return (
      <div>
        <div className="board-row">
          {this.renderCategorySquare(this.state.game.categories[0].name, 1)}
          {this.renderCategorySquare(this.state.game.categories[1].name, 2)}
          {this.renderCategorySquare(this.state.game.categories[2].name, 3)}
          {this.renderCategorySquare(this.state.game.categories[3].name, 4)}
          {this.renderCategorySquare(this.state.game.categories[4].name, 5)}
          {this.renderCategorySquare(this.state.game.categories[5].name, 6)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.state.game.categories[0].questions.filter(function(data){return data.value == 100})[0], 1)}
          {this.renderSquare(this.state.game.categories[1].questions.filter(function(data){return data.value == 100})[0], 2)}
          {this.renderSquare(this.state.game.categories[2].questions.filter(function(data){return data.value == 100})[0], 3)}
          {this.renderSquare(this.state.game.categories[3].questions.filter(function(data){return data.value == 100})[0], 4)}
          {this.renderSquare(this.state.game.categories[4].questions.filter(function(data){return data.value == 100})[0], 5)}
          {this.renderSquare(this.state.game.categories[5].questions.filter(function(data){return data.value == 100})[0], 6)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.state.game.categories[0].questions.filter(function(data){return data.value == 200})[0], 7)}
          {this.renderSquare(this.state.game.categories[1].questions.filter(function(data){return data.value == 200})[0], 8)}
          {this.renderSquare(this.state.game.categories[2].questions.filter(function(data){return data.value == 200})[0], 9)}
          {this.renderSquare(this.state.game.categories[3].questions.filter(function(data){return data.value == 200})[0], 10)}
          {this.renderSquare(this.state.game.categories[4].questions.filter(function(data){return data.value == 200})[0], 11)}
          {this.renderSquare(this.state.game.categories[5].questions.filter(function(data){return data.value == 200})[0], 12)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.state.game.categories[0].questions.filter(function(data){return data.value == 300})[0], 13)}
          {this.renderSquare(this.state.game.categories[1].questions.filter(function(data){return data.value == 300})[0], 14)}
          {this.renderSquare(this.state.game.categories[2].questions.filter(function(data){return data.value == 300})[0], 15)}
          {this.renderSquare(this.state.game.categories[3].questions.filter(function(data){return data.value == 300})[0], 16)}
          {this.renderSquare(this.state.game.categories[4].questions.filter(function(data){return data.value == 300})[0], 17)}
          {this.renderSquare(this.state.game.categories[5].questions.filter(function(data){return data.value == 300})[0], 18)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.state.game.categories[0].questions.filter(function(data){return data.value == 400})[0], 19)}
          {this.renderSquare(this.state.game.categories[1].questions.filter(function(data){return data.value == 400})[0], 20)}
          {this.renderSquare(this.state.game.categories[2].questions.filter(function(data){return data.value == 400})[0], 21)}
          {this.renderSquare(this.state.game.categories[3].questions.filter(function(data){return data.value == 400})[0], 22)}
          {this.renderSquare(this.state.game.categories[4].questions.filter(function(data){return data.value == 400})[0], 23)}
          {this.renderSquare(this.state.game.categories[5].questions.filter(function(data){return data.value == 400})[0], 24)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.state.game.categories[0].questions.filter(function(data){return data.value == 500})[0], 25)}
          {this.renderSquare(this.state.game.categories[1].questions.filter(function(data){return data.value == 500})[0], 26)}
          {this.renderSquare(this.state.game.categories[2].questions.filter(function(data){return data.value == 500})[0], 27)}
          {this.renderSquare(this.state.game.categories[3].questions.filter(function(data){return data.value == 500})[0], 28)}
          {this.renderSquare(this.state.game.categories[4].questions.filter(function(data){return data.value == 500})[0], 29)}
          {this.renderSquare(this.state.game.categories[5].questions.filter(function(data){return data.value == 500})[0], 30)}
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