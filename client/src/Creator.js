import React from 'react';
import { FormGroup, FormControl, Button, Row, Col } from 'react-bootstrap';
import Auth from './Auth';

class PreviewGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }


  componentDidUpdate() {
        this.setHover();
  }

  handleClick = (cat) => (e) => {
    this.props.loadCat(cat);
  }

  setHover() {
    var classes = ["catCol-1", "catCol-2", "catCol-3", "catCol-4", "catCol-5", "catCol-6", "currentCat"]; //list of your classes
    var elms = {};
    var n = {}, nclasses = classes.length;
    function changeColor(classname, color, bgcolor) {
      var curN = n[classname];
      for(var i = 0; i < curN; i ++) {
        elms[classname][i].style.backgroundColor = bgcolor;
        elms[classname][i].style.color = color;
      }
    }
    for(var k = 0; k < nclasses; k ++) {
      var curClass = classes[k];
      elms[curClass] = document.getElementsByClassName(curClass);
      n[curClass] = elms[curClass].length;
      var curN = n[curClass];
      for(var i = 0; i < curN; i ++) {

          elms[curClass][i].onmouseover = function() {
            changeColor(this.className, "black", "yellow");
        };
        elms[curClass][i].onmouseout = function() {
            changeColor(this.className, "white", "blue");
        };
      }
    };
  }

  createTable = (game) => {
    var table = [];
    var categories = [];
    var class_name;
    for(var i=0; i < 6; i++) {
      if (i === this.props.currentCat) {
        if (game[i]) {
          categories.push(<td key = {"cat " + i} className="currentCat">{game[i].name}</td>);
        }
        else {
          categories.push(<td key = {"cat " + i} className="currentCat"></td>)
        }
      }
      else if (game[i]) {
        class_name = "catCol-" + (i + 1);
        categories.push(<td key = {"cat " + i} className={class_name} onClick={this.handleClick(i)}>{game[i].name}</td>)
      }
      else {
        categories.push(<td key = {"cat " + i}></td>)
      }
    }
    table.push(<tr key = "categories" className="preview-category-row">{categories}</tr>)
    for (i = 100; i < 600; i = i + 100) {
      var questions = [];
      for (var j = 0; j < 6; j++) {
        class_name = "catCol-" + (j + 1);
        if (j === this.props.currentCat) {
          if (game[j]) {
            questions.push(<td key={i + " " + j} className="currentCat">{game[j].questions[String(i)]}</td>);
          }
          else {
            questions.push(<td key={i + " " + j} className="currentCat"></td>);
          }
        }
        else if (game[j]) {
          class_name = "catCol-" + (j + 1);
          questions.push(<td key={i + " " + j} className={class_name} onClick={this.handleClick(j)}>{game[j].questions[String(i)]}</td>);
        }
        else {
          questions.push(<td key={i + " " + j}></td>);
        }        
      }
      table.push(<tr key = {i} className="preview-row">{questions}</tr>)
    }
    return table;
  }

  render () {
        this.setHover();

    return(
      <table className="preview-game">
        <tbody>
        {this.createTable(this.props.game)}
        </tbody>
      </table>
    )
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
      cats_to_push: [],
      preview_game: [],
      currentCat: 0,
      editMode: false
    }
    this.loadCat = this.loadCat.bind(this);
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
      this.setState({gameID: res._id});        
      fetch('api/games/' + res._id + '/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Auth.getToken()
        },
        body: JSON.stringify({
          "_ids": this.state.cats_to_push          
        })
      })      
    })
    .then(res => {this.props.created()});
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.editMode) {
      fetch('api/categories/' + this.state.preview_game[this.state.currentCat], {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Auth.getToken()
        }
      })
    }
    var category = {
      "name": this.state.category_title,
      "questions": {
        "100": this.state.q1,
        "200": this.state.q2,
        "300": this.state.q3,
        "400": this.state.q4,
        "500": this.state.q5
      },
      _id: null
    }
    
    
    fetch('api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Auth.getToken()
        },
        body: JSON.stringify({
          "name": category.name,
          "index": this.state.currentCat  
        })
      })
      .then(res => res.json())
      .then(res => {
        var _id = res._id;
        var pg = this.state.preview_game;
        var cc;
        category._id = _id;
        if (this.state.editMode) {
          var ctp = this.state.cats_to_push;
          ctp[this.state.currentCat] = _id;
          this.setState({cats_to_push: ctp});
          pg[this.state.currentCat] = category;
        }
        else {
          this.state.cats_to_push.push(_id);
          pg.push(category);
        }
        if (this.state.editMode) {
          while (pg[this.state.currentCat]) {
            cc = this.state.currentCat + 1;
            this.setState({currentCat: cc});
          }
        }
        else {
          cc = this.state.currentCat + 1;
          this.setState({currentCat: cc});
        }
        this.setState({
          preview_game: pg,
          editMode: false
        });
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
          }, err => {
            console.log(err);
          });
        }
        

      }).catch(console.error);

    this.setState({
      category_title: "",
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: ""
    })
  }

  gameComplete() {
    if (this.state.preview_game.length > 5 && this.state.gameName.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  categoryComplete() {
    if (this.state.category_title.length > 0 && this.state.q1.length > 0 && this.state.q2.length > 0 && this.state.q3.length > 0 && this.state.q4.length > 0 && this.state.q5.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  loadCat(cat) {
    this.setState({currentCat: cat});
     fetch('api/categories/' + this.state.preview_game[cat]._id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Auth.getToken()
        }
      }).then(res => res.json())
      .then(res => {
        this.setState({
          category_title: res.name,
          q1: res.questions.filter(function(data){return data.value === 100})[0].question,
          q2: res.questions.filter(function(data){return data.value === 200})[0].question,
          q3: res.questions.filter(function(data){return data.value === 300})[0].question,
          q4: res.questions.filter(function(data){return data.value === 400})[0].question,
          q5: res.questions.filter(function(data){return data.value === 500})[0].question,
          editMode: true
        })
      })
  }

  render() {
    return(
      <div>
      <Row>
      <Button className="button btn-danger close-button button-font" onClick={this.props.closed}>Cancel</Button>
      <form onSubmit={this.createGame}>
      <FormGroup className="game-name" controlId="gameName">
        <FormControl className="formcontrol" type="text" value = {this.state.gameName} onChange={this.handleChange} placeholder = "Game Name" />
      </FormGroup>
      <Button className="button game-create-button" disabled={!this.gameComplete()} type="submit">Create Game</Button> 

      
    </form>
      </Row>
      <Row>
        <Col sm={4}>
      <form className="category-form" onSubmit={this.handleSubmit}>
        
        <FormGroup className="formgroup2" controlId="category_title">
          <FormControl className="formcontrol category-input" type="textarea" maxLength={28} value= {this.state.category_title} onChange={this.handleChange} placeholder = "Enter Category Title" />
        </FormGroup>
        <FormGroup className="formgroup2" controlId="q1">
          <FormControl className="formcontrol question-input" componentClass="textarea" rows={3} maxLength={100} value = {this.state.q1} onChange={this.handleChange} placeholder = "Question 1" />
        </FormGroup>
        <FormGroup className="formgroup2" controlId="q2">
          <FormControl className="formcontrol question-input" componentClass="textarea" rows={3} maxLength={100} value = {this.state.q2} onChange={this.handleChange} placeholder = "Question 2" />
        </FormGroup>
        <FormGroup className="formgroup2" controlId="q3">
          <FormControl className="formcontrol question-input" componentClass="textarea" rows={3} maxLength={100} value = {this.state.q3} onChange={this.handleChange} placeholder = "Question 3" />
        </FormGroup>
        <FormGroup className="formgroup2" controlId="q4">
          <FormControl className="formcontrol question-input" componentClass="textarea" rows={3} maxLength={100} value = {this.state.q4} onChange={this.handleChange} placeholder = "Question 4" />
        </FormGroup>
        <FormGroup className="formgroup2" controlId="q5">
          <FormControl className="formcontrol question-input" componentClass="textarea" rows={3} maxLength={100} value = {this.state.q5} onChange={this.handleChange} placeholder = "Question 5" />
        </FormGroup>
        <Button className="button button-font" disabled={!this.categoryComplete()} type="submit">Save </Button>

      </form>
      
    </Col>
    <Col sm={8}>
    <PreviewGame game={this.state.preview_game} currentCat={this.state.currentCat} loadCat={this.loadCat}/>
    </Col>
      </Row>
      </div>

    )
  }

}

export default Creator;