// Component to render list of items in a single cart
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Container,
  Row,
  Col,
  Button,
  Collapse,
  ButtonGroup,
  FormInput,
  FormFeedback,
  FormGroup } from 'shards-react'

import { faArrowDown, faArrowUp, faArrowRight, faPencilAlt, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { navigate } from "@reach/router"

import confirmService from '../Components/confirmService'
import ShoppingListItems from './ShoppingListItems'
import ShoppingListRecipes from './ShoppingListRecipes'

import ShoppingListService from '../store/services/ShoppingListService'


export default function SingleShoppingList (props) {
  const [ collapse, setCollapse ] = useState(false)
  const { handleSubmit, errors, register, setValue } = useForm()

  function setName () {
    setValue('name', props.name)
  }

  function toggle () {
    setCollapse(!collapse)
    setTimeout(setName, 10)
  }

  function navigateToDisplay (listId) {
    navigate(`/shopping-list/${listId}`)
  }

  async function addIngredient (values) {
    if (values.newIngredient.length < 1) {
      props.relayToast("error", "cannot add blank ingredient")
      return
    }
    let newIngredients = props.ingredients
    newIngredients.unshift(values.newIngredient)

    const requestPayload = {
      name: props.name,
      ingredients: newIngredients
    }
    try {
      let addIngredientResponse = await ShoppingListService.update(props.id, requestPayload)
      if (addIngredientResponse.status === 200) {
        const payload = {
          id: props.id
        }
        props.onIngredientChangeTop(payload)
        setValue('newIngredient', undefined)
      }
    } catch (error) {
      props.relayToast("error", error.response.data.message)
    }
  }

  async function updateName (values) {
    const requestPayload = {
      name: values.name,
      ingredients: props.ingredients
    }
    try {
      let updateNameResponse = await ShoppingListService.update(props.id, requestPayload)
      if (updateNameResponse.status === 200) {
        const payload = {
          id: props.id
        }
        props.onIngredientChangeTop(payload)
      }
    } catch (error) {
      props.relayToast("error", error.response.data.message)
    }
  }


  async function deleteShoppingList() {
    try {
      const result = await confirmService.show({
        title: 'Delete?',
        target: `#deleteButton-${props.id}`
      })
      if(result) {
        let deleteRecipeResponse = await ShoppingListService.delete(props.id)
        if (deleteRecipeResponse.status === 204) {
          const payload = {
            id: props.id
          }
          props.relayToast("success", "Shopping list deleted")
          props.onShoppingListDelete(payload)
        }
      }
    } catch (error) {
      console.error(error)
      props.relayToast("error", error.response.data.message)
    }
  }

  async function handleIngredientDelete(index) {
    let changedIngredients = props.ingredients
    changedIngredients.splice(index, 1)

    const requestPayload = {
      name: props.name,
      ingredients: changedIngredients
    }
    try {
      let deleteIngredientResponse = await ShoppingListService.update(props.id, requestPayload)
      if (deleteIngredientResponse.status === 200) {
        const payload = {
          index: index,
          id: props.id
        }
        props.onIngredientChangeTop(payload)
      }
    } catch (error) {
      props.relayToast("error", error.response.data.message)
    }
  }

  async function handleIngredientUpdate(payload) {
    let changedIngredients = props.ingredients
    changedIngredients[payload.index] = payload.newItem

    const requestPayload = {
      name: props.name,
      ingredients: changedIngredients
    }
    try {
      let updateIngredientResponse = await ShoppingListService.update(props.id, requestPayload)
      if (updateIngredientResponse.status === 200) {
        const parentsPayload = {
          id: props.id
        }
        props.onIngredientChangeTop(parentsPayload)
      }
    } catch (error) {
      props.relayToast("error", error.response.data.message)
    }
  }

  async function handleRecipeDelete(payload) {
    const requestPayload = {
      recipe_id: payload.id
    }
    try {
      let updatedList = await ShoppingListService.deleteSingleRecipe(props.id, requestPayload)
      if (updatedList.status === 200) {
        const parentsPayload = {
          id: props.id
        }
        props.onIngredientChangeTop(parentsPayload)
      }
    } catch(error) {
      props.relayToast("error", error.response.data.message)
    }
  }

  function validateName (value) {
    let error
    if (!value) {
      error = 'Name cannot be blank'
    }
    return error || true
  }

  return (
    <Container>
      <Button className='mb-2' outline onClick={toggle}>{ props.name }
        <FontAwesomeIcon className='ml-1' icon = { collapse ? faArrowUp : faArrowDown } />
      </Button>
      <Button size='sm' className='ml-1' theme="info" onClick={ () => { navigateToDisplay(props.id) } }>Open Display View
        <FontAwesomeIcon className='ml-1' icon={faArrowRight} />
      </Button>
      { collapse &&
        <Container>
          {/* Edit the recipe name or delete it */}
          <Row className='w-50 my-2'>
            <Col>
              <form onSubmit={handleSubmit(updateName)}>
                <div className="form-row">
                  <FormGroup className="col">
                    <FormInput
                      name="name"
                      size='sm'
                      invalid = { Boolean(errors.name) }
                      innerRef={register({ validate: validateName })} />
                    <FormFeedback>
                      {errors.name && errors.name.message}
                    </FormFeedback>
                  </FormGroup>

                  <FormGroup className="col">
                    <ButtonGroup>
                      <Button size='sm' className='ml-1' theme="primary" type="submit">
                        <FontAwesomeIcon className='ml-1' icon={faPencilAlt} />
                      </Button>
                      <Button size='sm' id={`deleteButton-${props.id}`} className='ml-1' theme="danger" onClick={ () => { deleteShoppingList() } }>
                        <FontAwesomeIcon className='ml-1' icon={faTrash} />
                      </Button>
                    </ButtonGroup>
                  </FormGroup>
                </div>
              </form>
            </Col>
          </Row>

          <h6>Recipes</h6>
          <ShoppingListRecipes id={props.id}
                               key={props.addedRecipes}
                               addedRecipes={props.addedRecipes}
                               onRecipeDelete={handleRecipeDelete}
                               relayToast={props.relayToast}/>
          {/* Delete or edit ingredients */}
          <h6>Ingredients</h6>
          <Row className='w-50 my-2'>
            <Col>
              <form onSubmit={handleSubmit(addIngredient)}>
                <div className="form-row">
                  <FormGroup className="col">
                    <FormInput
                      name="newIngredient"
                      size='sm'
                      invalid = { Boolean(errors.newIngredient) }
                      placeholder="add ingredient"
                      innerRef={register()} />
                    <FormFeedback>
                      {errors.newIngredient && errors.newIngredient.message}
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup className="col">
                    <Button size='sm' theme="primary" type="submit">
                      <FontAwesomeIcon className='ml-1' icon={faPlus} />
                    </Button>
                  </FormGroup>
                </div>
              </form>
            </Col>
          </Row>
        </Container>
      }
      <Collapse open={ collapse }>
        <ShoppingListItems id={props.id}
                           key={props.ingredients}
                           ingredients={props.ingredients}
                           onIngredientDelete={handleIngredientDelete}
                           onIngredientUpdate={handleIngredientUpdate}/>
      </Collapse>
    </Container>
  )

}

