import React, { useState, useEffect }  from "react"
import { useForm } from 'react-hook-form'

import { Button,
         ButtonGroup,
         FormGroup,
         FormSelect,
         FormFeedback,
         Modal,
         ModalBody,
         ModalHeader,
         ModalFooter} from "shards-react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons"

import UserService from '../store/services/UserService'
import ShoppingListService from '../store/services/ShoppingListService'

export default function AdderModal (props) {
  const [ open, setOpen ] = useState(false)
  const [shoppingListOptions, setShoppingListOptions] = useState('')
  const { handleSubmit, errors, register, setValue, getValues } = useForm()

  useEffect(() => {
    props.setTogglePopover(toggle)
    if (localStorage.getItem('authToken')) {
      fetchShoppingLists()
    }
    // Since our form is only a select we need use a listener to watch for enter
    // and execute the function that adds a recipe to a list
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        const values = getValues()
        if (Object.keys(values).length) {
          addToShoppingList()
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  },[])

  function toggle () {
    if (localStorage.getItem('authToken')) {
      setOpen(!open)
    } else {
      props.relayToast("error", "Please sign in to do this")
    }
  }

  async function addToShoppingList (values) {
    // If values are undefined get them
    if (values === undefined) {
      values = getValues()
    }
    const payload = {
      recipe_id: props.recipe._id.$oid
    }
    try {
      let shoppingListAdderResponse = await ShoppingListService.updateWithRecipe(values.shoppingListSelection, payload)
      if (shoppingListAdderResponse.status === 200) {
        props.relayToast("success", "Recipe Added")
        toggle()
      }
    } catch (error) {
      console.error(error)
      props.relayToast("error", error.response.data)
    }
  }

  async function fetchShoppingLists () {
    try {
      let shoppingListResponse = await UserService.fetchUserData('shopping-list')
      if (shoppingListResponse.status === 200) {
        let listOptions = []
        shoppingListResponse.data.forEach(item => {
          let payload = {
            name: item.name,
            id: item._id.$oid
          }
          listOptions.push(payload)
          setShoppingListOptions(listOptions)
          setValue('shoppingListSelection', listOptions[0].id)
        });
      }
    } catch (error) {
      props.relayToast("error", error.response.data.message)
    }
  }

  let lister = shoppingListOptions.length > 0
  && shoppingListOptions.map( (value, index) => {
    return (
      <option key={index} value={value.id}>{value.name}</option>
    )
  })

  function validateList (value) {
    let error
    if (!value) {
      error = 'Selected shopping list cannot be blank'
    }
    return error || true
  }

  return (
    <div>
      <Modal placement="bottom"
            open={open}
            toggle={toggle}>
        <ModalHeader>Add {props.recipe.name} to shopping list</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(addToShoppingList)}>
            <FormGroup>
              <label htmlFor="#shoppingListSelection">Shopping List</label>
              <FormSelect name="shoppingListSelection"
                size='sm'
                id='#shoppingListSelection'
                invalid = { Boolean(errors.shoppingListSelection) }
                innerRef={register({ validate: validateList })}>
                {lister}
              </FormSelect>
              <FormFeedback>
                {errors.shoppingListSelection && errors.shoppingListSelection.message}
              </FormFeedback>
            </FormGroup>
            <Button
              className='d-none'
              type="submit">
            </Button>
          </form>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup className='float-left'>
            <Button theme='danger' className='ml-1' onClick={ () => { toggle() } }>
              <FontAwesomeIcon className='ml-1' icon={faTimes} />
            </Button>
            <Button className='ml-1'
                    theme="secondary"
                    onClick={ () => { addToShoppingList() } }>
              <FontAwesomeIcon className='ml-1' icon={faPencilAlt} />
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </div>
  )
}
