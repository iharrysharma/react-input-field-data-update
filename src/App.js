import React, { Component } from 'react';
import './App.css';
import ValidationComponent from './ValidationComponent/ValidationComponent';
import CharComponent from './CharComponent/CharComponent';

class App extends Component {
  state = {
    charCount: '0',
    string: ''
  }
  changeHandler = (event) => {
    this.setState({
      charCount: event.target.value.length,
      string: event.target.value
    })
  }

  deleteCharHandler = (index, singleString) => {
    const lastString = this.state.string;
    const strToArr = lastString.split('');
    strToArr.splice(index, 1);
    this.setState({
      charCount: strToArr.join('').length,
      string : strToArr.join('')
    })
  }

  render() {
    const iterateString = (this.state.string ? this.state.string.split('').map((singleString, index) => {
      return (<CharComponent data={singleString} key={index} click={() => this.deleteCharHandler(index, singleString)} />);
    }) : null
    )

    return (
      <div className="App">
        <h1>New Assignment</h1>
        <input name="star" value={this.state.string} onChange={(event) => this.changeHandler(event)} />
        <p>Entered Character : {this.state.string}</p>
        <ValidationComponent character={this.state.charCount} />
        {iterateString}
      </div>
    );
  }
}

export default App;
