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
      <Container className='mt-3'>
        <h2>Search</h2>
        <SearchAutoSuggest />
      </Container>
    )
  }
}
