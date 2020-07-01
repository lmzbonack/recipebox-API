import React from "react"
import ExportRouter from "./Components/Router"
import NavRecipe from "./Components/Navbar"

import "bootstrap/dist/css/bootstrap.min.css"
import "shards-ui/dist/css/shards.min.css"
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: Boolean(localStorage.getItem('authToken'))
    }
  }

  render() {
    return(
      <div>
        <NavRecipe key={this.state.loggedIn}
                   loggedIn={this.state.loggedIn}/>
        <ExportRouter propogateLogin = {() => {this.setState({loggedIn:true})}}/>
      </div>
    )
  }
}

export default App;
