import React, { useEffect } from 'react'

import { useForm } from 'react-hook-form'

import {
  Button,
  FormInput,
  FormFeedback,
  FormGroup } from 'shards-react'

import ShoppingListService from '../../store/services/ShoppingListService'

export default function ShoppingListForm (props) {
  const { handleSubmit, errors, register, getValues, trigger } = useForm()

  useEffect(() => {
    props.setCreateShoppingList(createNewShoppingList)
  // eslint-disable-next-line
  }, [])

  function validateShoppingListName (value) {
    let error
    if (!value) {
      error = 'Name is required'
    }
    return error || true
  }

  async function createNewShoppingList (values) {
    // If calling from outside this component
    if (values === undefined) {
      values = getValues()
    }
    // Check the validity again in case it is being called from outside this component
    let valid = await trigger()
    if (valid) {
      const payload = {
        name: values.shoppingListName
      }
      try {
        let createList = await ShoppingListService.create(payload)
        if (createList.status === 201) {
          props.relayToast("success", "Shopping List Created")
          props.onShoppingListChangeTop({})
        }
      } catch (error) {
        props.relayToast("error", error.response.data.message)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(createNewShoppingList)}>
      <FormGroup>
        <label htmlFor="#shoppingListName">Shopping List Name</label>
        <FormInput name="shoppingListName"
          invalid = { Boolean(errors.shoppingListName) }
          placeholder="Sundry"
          innerRef={register({ validate: validateShoppingListName })} />
        <FormFeedback>
          {errors.shoppingListName && errors.shoppingListName.message}
        </FormFeedback>
      </FormGroup>
      {/* Hide this button in favor of button in modal */}
      <Button
        className='d-none'
        type="submit">
        Login
      </Button>
    </form>
  )
}
