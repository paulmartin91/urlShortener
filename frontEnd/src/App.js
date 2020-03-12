import React from 'react';
import './App.css';

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      value: "",
      test: ""
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event){
    this.setState({
      value: event.target.value
    })
  }

  handleClick(event){
    console.log(event.target.value)
    let urlToShortern = event.target.value
    fetch('http://localhost:3001/new - '+urlToShortern) //new/' + this.state.value)
    .then(res=>{
      let toString = res.text()
      return toString
    })
    .then(data=>{
      this.setState({
        test: data
      })
    })
  }

  render(){
    return(
      <div>
        <h1>URL Shortening microservice</h1>
        <p>On this site you can add in a URL and our server will shortern it for you.</p>
          <input placeholder = 'Enter URL here...' value = {this.state.value} onChange={this.handleChange} />
          <button value={this.state.value} onClick={this.handleClick}/>
          <p>{this.state.test}</p>
      </div>
    )
  }

}

export default App;
