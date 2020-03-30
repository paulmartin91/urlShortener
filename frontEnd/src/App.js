import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const serverAddress = 'http://localhost:3001'

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      value: "",
      instance: "",
      listModules: [],
      ids: []
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount(){
    fetch(`${serverAddress}/api/getlist`).then( async res=>{
      console.log('hit')
     let array = await res.json()
     //console.log(array)
     return array
    }).then( async res=>{
      let list = await {}
      list.urls = await Object.keys(res).map(x=>res[x].url)
      list.id = await Object.keys(res).map(x=>res[x]._id)
     // console.log(list)
      return list
    }).then(res=>{
      this.setState({
        listModules: res.urls,
        ids: res.id
      })
    })
  }

  handleChange(event){
    this.setState({
      value: event.target.value
    })
  }

  handleClick(event){
    let urlToShortern = event.target.value
    console.log(urlToShortern)
    fetch(`${serverAddress}/new%20-%20${urlToShortern}`, 
      {
        method: 'get', 
        headers: {
          'Content-Type': 'application/json'
        }
      }
      ) //new/' + this.state.value)
      .then( async data=>{
      let dataJSON = await data.json()
      // let urls = Object.keys(dataJSON.fullList).map(x=>dataJSON.fullList[x].url)
      let urls = await Object.keys(dataJSON.fullList).map(x=>dataJSON.fullList[x].url)
      let id = await Object.keys(dataJSON.fullList).map(x=>dataJSON.fullList[x]._id)
      this.setState({
          resUrl: 'http://localhost:3001/'+data.link,
          listModules: urls,
          instance: data.instance,
          ids: id
        })
      })
  }

  render(){
    return(
      <div>
        <div className="jumbotron text-center" style={{"marginBottom": 50}}>
          <h1>URL Shortening microservice</h1>
          <p>On this site you can add in a URL and our server will shortern it for you.</p>
        </div>
        <div className="container" >
        <div className="input-group w-50">
          <input type="text" className="form-control input-sm" placeholder = 'Enter URL here...' value = {this.state.value} onChange={this.handleChange} />
          <button type="button" className="btn btn-success" style={{"marginLeft": "5px"}} value={this.state.value} onClick={this.handleClick}>Shortern URL</button>
        </div>
        <br />
            <h1>Url List<span style={{"marginLeft": "25px"}} className="badge badge-pill badge-primary" >{this.state.ids.length}</span></h1>
            {this.state.ids.length === 0 ? 
              <p>No URLs in list</p> 
              : 
              this.state.ids.map((x, y)=>{
                return (
                  <a href={`${serverAddress}/${x}`} className="list-group-item" href = {`${serverAddress}/${x}`}>
                  <h4 className="list-group-item-heading">{`${serverAddress}/${x}`}</h4>
                  <p className="list-group-item-text">{this.state.listModules[y]}</p>
                  </a>
                )
              })
            }
          </div>
        <footer class="py-4 bg-light" style={{"marginTop": 50}}>
          <div class="footer-copyright text-center py-3">
            <p>Coded by <a href="https://paulmartin91.github.io/">Paul Martin</a></p>
          </div>
        </footer>
      </div>
    )
  }

}

export default App;
