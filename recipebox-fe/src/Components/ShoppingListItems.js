import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalHeader,
  FormFeedback,
  FormInput,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Container } from "shards-react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons"

import confirmService from '../Components/confirmService'

export default function ShoppingListItems (props) {
  const [ open, setOpen ] = useState(false)
  const [activeIndex, setActiveIndex] = useState('')

  const { handleSubmit, errors, register, setValue } = useForm()

  function toggleModal () {
    setOpen(!open)
    setActiveIndex('')
  }

  function setIngredient (value) {
    setValue('ingredient', value)
  }

  function openModal (index, value) {
    setOpen(!open)
    setActiveIndex(index)
    // This is dumb but works for now
    setTimeout( () => {setIngredient(value)}, 10)
  }

  async function handleDelete (index) {
    setActiveIndex(index)
    const result = await confirmService.show({
      title: 'Delete?',
      target: `#deleteButtonSingleItem-${index}-${props.id}`
    })
    if(result) {
      props.onIngredientDelete(index)
    }
  }

  function handleUpdate (values) {
    const payload = {
      index: activeIndex,
      newItem: values.ingredient
    }
    props.onIngredientUpdate(payload)
  }

  function validateIngredient (value) {
    let error
    if (!value) {
      error = 'Ingredient cannot be blank'
    }
    return error || true
  }

  return (
    <Container>
      <ListGroup flush small>
        { props.ingredients.map( (ingredient, index) => (
          <ListGroupItem className="mb-1" key={index}>
            { ingredient }
            <ButtonGroup className='ml-2 float-right'>
              <Button size='sm' theme='primary' onClick={ () => { openModal(index, ingredient) } }>
                <FontAwesomeIcon className='ml-1' icon={faPencilAlt} />
              </Button>
              <Button size='sm' id={`deleteButtonSingleItem-${index}-${props.id}`} theme='danger' className='ml-1' onClick={ () => { handleDelete(index) } }>
                <FontAwesomeIcon className='ml-1' icon={faTrash} />
              </Button>
            </ButtonGroup>
          </ListGroupItem>
        ))}
      </ListGroup>
      <Modal open={open} toggle={toggleModal}>
          <ModalHeader>Edit Ingredient</ModalHeader>
        <ModalBody>

          <form onSubmit={handleSubmit(handleUpdate)}>
            <FormGroup>
              <label htmlFor="#ingredient">Ingredient</label>
              <FormInput name="ingredient"
                invalid = { Boolean(errors.ingredient) }
                innerRef={register({ validate: validateIngredient })} />
              <FormFeedback>
                {errors.ingredient && errors.ingredient.message}
              </FormFeedback>
            </FormGroup>
            <ButtonGroup className='float-right'>
              <Button className='w-20' theme='primary' type="submit">
                <FontAwesomeIcon className='ml-1' icon={faPencilAlt} />
              </Button>
              <Button theme='danger' className='ml-1' onClick={ () => { toggleModal() } }>
                <FontAwesomeIcon className='ml-1' icon={faTimes} />
              </Button>
            </ButtonGroup>
          </form>

        </ModalBody>
      </Modal>
    </Container>
  )
}
