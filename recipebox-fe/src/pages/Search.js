import React from 'react'
import SearchAutoSuggest from '../Components/SearchAutoSuggest'
import { Container } from 'shards-react'


export default class Search extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      temp: ''
    }
  }

  render(){
    return(
      <Container>
        <h2>Search</h2>
        <SearchAutoSuggest />
      </Container>
    )
  }
}
