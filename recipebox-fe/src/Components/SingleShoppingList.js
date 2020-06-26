// Component to render list of items in a single cart
import React from 'react'
import {
  Container,
  Button,
  Collapse,
  InputGroup,
  FormInput,
  FormGroup } from 'shards-react'
import { faArrowDown, faArrowUp, faArrowRight, faPencilAlt, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { navigate } from "@reach/router"

import confirmService from '../Components/confirmService'
import ShoppingListItems from './ShoppingListItems'
import ShoppingListRecipes from './ShoppingListRecipes'

import ShoppingListService from '../store/services/ShoppingListService'


export default class SingleShoppingList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapse: false,
      name: '',
      newIngredient: '',
    }
    this.toggle = this.toggle.bind(this)
    this.handleRecipeDelete = this.handleRecipeDelete.bind(this)
    this.handleIngredientDelete = this.handleIngredientDelete.bind(this)
    this.handleIngredientUpdate = this.handleIngredientUpdate.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.updateName = this.updateName.bind(this)
    this.deleteShoppingList = this.deleteShoppingList.bind(this)
    this.addIngredient = this.addIngredient.bind(this)
    this.navigateToDisplay = this.navigateToDisplay.bind(this)
  }

  componentDidMount() {
    this.setState( (state, props) => ({
      collapse: state.collapse,
      name: props.name,
      newIngredient: ''
    }))
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse })
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  navigateToDisplay(listId) {
    navigate(`/shopping-list/${listId}`)
  }

  async addIngredient() {
    let newIngredients = this.props.ingredients
    if (this.state.newIngredient.length === 0) {
      this.props.relayToast("error", "Cannot add blank ingredient")
      return
    }
    newIngredients.unshift(this.state.newIngredient)
    const requestPayload = {
      name: this.props.name,
      ingredients: newIngredients
    }
    try {
      let addIngredientResponse = await ShoppingListService.update(this.props.id, requestPayload)
      if (addIngredientResponse.status === 200) {
        const payload = {
          id: this.props.id
        }
        this.props.onIngredientChangeTop(payload)
        this.setState({
          newIngredient: ''
        })
      }
    } catch (error) {
      this.props.relayToast("error", error.response.data.message)
    }
  }

  async updateName(name) {
    const requestPayload = {
      name: name,
      ingredients: this.props.ingredients
    }
    try {
      let updateNameResponse = await ShoppingListService.update(this.props.id, requestPayload)
      if (updateNameResponse.status === 200) {
        const payload = {
          id: this.props.id
        }
        this.props.onIngredientChangeTop(payload)
      }
    } catch (error) {
      this.props.relayToast("error", error.response.data.message)
    }
  }

  async deleteShoppingList() {
    try {
      const result = await confirmService.show({
        title: 'Delete?',
        target: `#deleteButton-${this.props.id}`
      })
      if(result) {
        let deleteRecipeResponse = await ShoppingListService.delete(this.props.id)
        if (deleteRecipeResponse.status === 204) {
          const payload = {
            id: this.props.id
          }
          this.props.relayToast("success", "Shopping list deleted")
          this.props.onIngredientChangeTop(payload)
        }
      }
    } catch (error) {
      this.props.relayToast("error", error.response.data.message)
    }
  }

  async handleIngredientDelete(index) {
    // Make changes using API
    let changedIngredients = this.props.ingredients
    changedIngredients.splice(index, 1)

    const requestPayload = {
      name: this.props.name,
      ingredients: changedIngredients
    }
    try {
      let deleteIngredientResponse = await ShoppingListService.update(this.props.id, requestPayload)
      if (deleteIngredientResponse.status === 200) {
        const payload = {
          index: index,
          id: this.props.id
        }
        this.props.onIngredientChangeTop(payload)
      }
    } catch (error) {
      this.props.relayToast("error", error.response.data.message)
    }
  }

  async handleIngredientUpdate(payload) {
    let changedIngredients = this.props.ingredients
    changedIngredients[payload.index] = payload.newItem

    const requestPayload = {
      name: this.props.name,
      ingredients: changedIngredients
    }
    try {
      let updateIngredientResponse = await ShoppingListService.update(this.props.id, requestPayload)
      if (updateIngredientResponse.status === 200) {
        this.closeChildModal()
        const parentsPayload = {
          id: this.props.id
        }
        this.props.onIngredientChangeTop(parentsPayload)
      }
    } catch (error) {
      this.props.relayToast("error", error.response.data.message)
    }
  }

  async handleRecipeDelete(payload) {
    const requestPayload = {
      recipe_id: payload.id
    }
    console.log(requestPayload)
    try {
      let updatedList = await ShoppingListService.deleteSingleRecipe(this.props.id, requestPayload)
      if (updatedList.status === 200) {
        const parentsPayload = {
          id: this.props.id
        }
        this.props.onIngredientChangeTop(parentsPayload)
      }
    } catch(error) {
      this.props.relayToast("error", error.response.data.message)
    }
  }

  render() {
    return (
      <Container>
        <Button className='mb-2' outline onClick={this.toggle}>{ this.props.name }
          <FontAwesomeIcon className='ml-1' icon = { this.state.collapse ? faArrowUp : faArrowDown } />
        </Button>
        { this.state.collapse &&
          <FormGroup>
            <InputGroup className='w-50 mb-2'>
              <FormInput size='sm' name='name' value={this.state.name} onChange={this.handleInputChange}/>
              <Button size='sm' className='ml-1' theme="primary" onClick={ () => { this.updateName(this.state.name) } }>
                <FontAwesomeIcon className='ml-1' icon={faPencilAlt} />
              </Button>
              <Button size='sm' className='ml-1' theme="info" onClick={ () => { this.navigateToDisplay(this.props.id) } }>Open Display View
                <FontAwesomeIcon className='ml-1' icon={faArrowRight} />
              </Button>
              <Button size='sm' id={`deleteButton-${this.props.id}`} className='ml-1' theme="danger" onClick={ () => { this.deleteShoppingList() } }>
                <FontAwesomeIcon className='ml-1' icon={faTrash} />
              </Button>
            </InputGroup>
            <h6>Recipes</h6>
            <ShoppingListRecipes id={this.props.id}
                                 addedRecipes={this.props.addedRecipes}
                                 onRecipeDelete={this.handleRecipeDelete}
                                 relayToast={this.props.relayToast}/>
            <h6>Ingredients</h6>
            <InputGroup className='w-50'>
              <FormInput size='sm' placeholder= 'add ingredient' name='newIngredient' value={this.state.newIngredient} onChange={this.handleInputChange}/>
              <Button  size='sm'className='ml-1' theme="primary" onClick={ () => { this.addIngredient() } }>
                <FontAwesomeIcon className='ml-1' icon={faPlus} />
              </Button>
            </InputGroup>
          </FormGroup>
        }
        <Collapse open={ this.state.collapse }>
          <ShoppingListItems id={this.props.id}
                             ingredients={this.props.ingredients}
                             onIngredientDelete={this.handleIngredientDelete}
                             onIngredientUpdate={this.handleIngredientUpdate}
                             closeModal={close => this.closeChildModal = close}/>
        </Collapse>
      </Container>
    )
  }
}
