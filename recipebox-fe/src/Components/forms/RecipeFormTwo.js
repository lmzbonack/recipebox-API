import React, { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'


import { Button,
         Collapse,
         InputGroup,
         Form,
         FormInput,
         FormTextarea,
         FormSelect,
         FormGroup,
         ListGroup,
         Container} from "shards-react"

import { faArrowDown, faArrowUp, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import confirmService from '../confirmService'
import RecipeService from '../../store/services/RecipeService'
import ScrapingManifestService from '../../store/services/ScrapingManifestService'

export default function RecipeForm (props) {
  const { handleSubmit, errors, register, getValues, trigger, setValue } = useForm()
  const [ collapseInstructions, setCollapseInstructions ] = useState(false)
  const [ collapseIngredients, setCollapseIngredients ] = useState(false)
  const [ ingredients, setIngredients ] = useState([])
  const [ instructions, setInstructions ] = useState([])


  useEffect(() => {
    // setValue for props in here to load into form
    if (props.mode === 'edit') {
      console.log('set ing and instructions and form values')
      props.setRecipeEdit(submitEditedRecipe)
      props.setRecipeDelete(deleteRecipe)
      props.setStarRecipe(starRecipe)
    }
    if (props.mode === 'create') {
      props.setCreateRecipe(submitCreatedRecipe);
      props.setScrapeRecipe(scrapeNewRecipe)
    }
  })

  function convertBlankStringToNull(val) {
    return (val === '' ? null : val)
  }

  async function submitCreatedRecipe (values) {
    const id = props.recipe._id.$oid

    let filteredIngredients = state.ingredients.filter( (val) => {
      return val !== ''
    })

    let filteredInstructions = state.instructions.filter( (val) => {
      return val !== ''
    })

    const payload = {
      name: values.name,
      author: values.author,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      prep_time: convertBlankStringToNull(values.prep_time),
      prep_time_units: convertBlankStringToNull(values.prep_time_units),
      cook_time: convertBlankStringToNull(values.cook_time),
      cook_time_units: convertBlankStringToNull(values.cook_time_units),
      external_link: values.external_link,
    }

    try {
      let updatedRecipeResponse = await RecipeService.create(payload)
      if (updatedRecipeResponse.status === 201) {
        const payload = {
          operation: "create",
          id: id
        }
        props.relayToast("success", "Recipe Created")
        props.onRecipesChangeTop(payload)
      }
    } catch (error) {
      props.relayToast("error", error.response.data.message)
    }
  }

  async function starRecipe() {
    try {
      let starRecipeResponse = await RecipeService.star(props.recipe._id.$oid)
      if (starRecipeResponse.status === 200) {
        props.relayToast("success", "Recipe Starred")
        props.onRecipesStarredTop({"id": props.recipe._id.$oid})
      }
    } catch (error) {
      props.relayToast("error", error.response.data)
    }
  }

  async function submitEditedRecipe (values) {
    const id = props.recipe._id.$oid

    let filteredIngredients = state.ingredients.filter( (val) => {
      return val !== ''
    })

    let filteredInstructions = state.instructions.filter( (val) => {
      return val !== ''
    })

    const payload = {
      name: values.name,
      author: values.author,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      prep_time: values.prep_time,
      prep_time_units: values.prep_time_units,
      cook_time: values.cook_time,
      cook_time_units: values.cook_time_units,
      external_link: values.external_link,
    }

    try {
      let updatedRecipeResponse = await RecipeService.update(id, payload)
      if (updatedRecipeResponse.status === 200) {
        const payload = {
          operation: "edit",
          id: id
        }
        props.relayToast("success", "Recipe Edited")
        props.onRecipesChangeTop(payload)
      }
    } catch (error) {
      props.relayToast("error", error.response.data.message)
    }
  }

  async function deleteRecipe () {
    const id = props.recipe._id.$oid

    try {
      const result = await confirmService.show({
        title: 'Delete?',
        target: '#deleteButton'
      })
      if (result) {
        let updatedRecipeResponse = await RecipeService.delete(id)
        if (updatedRecipeResponse.status === 204) {
          const payload = {
            operation: "delete",
            id: id
          }
          props.relayToast("success", "Recipe Deleted")
          props.onRecipesChangeTop(payload)
        }
      }
    } catch (error) {
      props.relayToast("error", error.response.data.message)
    }
  }

  async function scrapeNewRecipe () {
    const values = getValues()

    try {
      const payload = {
        url: values.external_link
      }
      let scrapingResults = await ScrapingManifestService.scrape(payload)

      let cookTimeLocal = null
      let calculatedCookTimeUnits = null
      let prepTimeLocal = null
      let calculatedPrepTimeUnits = null

      // use setValue here
      // this.setState({
      //   name: scrapingResults.data.name,
      //   author: scrapingResults.data.author,
      //   ingredients: scrapingResults.data.ingredients,
      //   instructions: scrapingResults.data.instructions,
      //   prep_time: prepTimeLocal,
      //   prep_time_units: calculatedPrepTimeUnits,
      //   cook_time: cookTimeLocal,
      //   cook_time_units: calculatedCookTimeUnits
      // })

    } catch (error) {
      props.relayToast("error", error.response.data.message)
    }
  }

  function toggleInstructions () {
    setCollapseInstructions(!collapseInstructions)
  }

  function toggleIngredients () {
    setCollapseIngredients(!collapseIngredients)
  }

  function addIngredient () {
    const values = getValues()
    let newIngredient = values.newIngredient
    if (newIngredient.length === 0) {
      props.relayToast("error", "Cannot add blank ingredient")
      return
    }
    ingredients.unshift(newIngredient)
    setIngredients(newIngredients)
    setValue('newIngredient', '')
  }

  function addInstruction () {
    const values = getValues()
    let newInstruction = values.newInstruction
    if (newInstruction.length === 0) {
      props.relayToast("error", "Cannot add blank ingredient")
      return
    }
    instructions.unshift (newInstruction)
    setInstructions(newIngredients)
    setValue('newInstruction', '')
  }

  function validateName (value) {
    let error
    if (!value) {
      error = 'Name required'
    }
    return error || true
  }


  // return (
  //   <form { props.mode==='create' ? onSubmit=handleSubmit(submitCreatedRecipe) : onSubmit=handleSubmit(submitEditedRecipe) }>
  //     <FormGroup>
  //       <label htmlFor="#name">Name</label>
  //       <FormInput name="name"
  //         invalid = { Boolean(errors.name) }
  //         innerRef={register({ validate: validateName })} />
  //       <FormFeedback>
  //         {errors.name && errors.name.message}
  //       </FormFeedback>
  //     </FormGroup>
  //   </form>
  // )


}
