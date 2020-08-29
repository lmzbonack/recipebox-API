import React from 'react'

import { Button,
         Container,
         ButtonGroup,
         ListGroup,
         ListGroupItem } from "shards-react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

import RecipeService from '../store/services/RecipeService'
import confirmService from '../Components/confirmService'

export default class ShoppingListRecipes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeId: '',
      activeName: '',
      recipes: []
    }
    this.fetchRecipeName = this.fetchRecipeName.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  async componentDidMount() {
    let localRecipes = []
    for (let element of this.props.addedRecipes) {
      let item = {}
      item['name'] = await this.fetchRecipeName(element.$oid)
      item['id'] = element.$oid
      localRecipes.push(item)
    }
    this.setState({
      recipes: localRecipes
    })
  }

  async fetchRecipeName(id) {
    try {
      let recipeResponse = await RecipeService.fetchOne(id)
      if (recipeResponse.status === 200) {
        return recipeResponse.data.name
      }
    } catch(error) {
      this.props.relayToast("error", error.response.data.message)
    }
  }

  async handleDelete(index, id, name) {
    this.setState({
      activeId: id,
      activeName: name
    })
    const result = await confirmService.show({
      title: 'Delete?',
      target: `#deleteButton-${index}-${this.props.id}`
    })
    if(result) {
      const payload = {
        "id": this.state.activeId,
        "name": this.state.activeName
      }
      this.props.relayToast("success", "Recipe removed")
      this.props.onRecipeDelete(payload)
    }
  }

  render() {
    return (
      <Container>
        <ListGroup small flush>
          { this.state.recipes.map( (recipe, index) => (
            <ListGroupItem className="mt-1 mb-1" key={index}>
              <a href={`/recipes/${recipe.id}`}>
                { recipe.name }
              </a>
              <ButtonGroup className='ml-2 float-right'>
                <Button size='sm' id= {`deleteButton-${index}-${this.props.id}`} theme='danger' className='ml-1' onClick={ () => { this.handleDelete(index, recipe.id, recipe.name) } }>
                  <FontAwesomeIcon className='ml-1' icon={faTrash} />
                </Button>
              </ButtonGroup>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Container>
    )
  }
}
