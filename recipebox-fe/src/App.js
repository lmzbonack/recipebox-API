import React from "react"
import ExportRouter from "./Components/Router"
import LocalNav from "./Components/Navbar"

import "bootstrap/dist/css/bootstrap.min.css"
import "shards-ui/dist/css/shards.min.css"
import './App.css'

const App = () => {
  return (
    <div>
      <LocalNav/>
      <ExportRouter/>
    </div>
  )
}

export default App;
