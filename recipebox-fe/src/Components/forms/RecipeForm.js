import React from 'react'

import { Button,
         Collapse,
         InputGroup,
         Form,
         FormInput,
         FormTextarea,
         FormSelect,
         FormGroup,
         ListGroup } from "shards-react"

import { faArrowDown, faArrowUp, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import confirmService from '../confirmService'
import RecipeService from '../../store/services/RecipeService'
import ScrapingManifestService from '../../store/services/ScrapingManifestService'

export default class RecipeForm extends React.Component {
  constructor(props){
    super(props)
    if (props.mode === 'edit') {
      this.state = {
        newIngredient: '',
        newInstruction: '',
        collapseInstructions: false,
        collapseIngredients: false,
        id: this.props.recipe._id.$oid,
        name: this.props.recipe.name,
        author: this.props.recipe.author,
        ingredients: this.props.recipe.ingredients,
        instructions: this.props.recipe.instructions,
        prep_time: this.props.recipe.prep_time,
        prep_time_units: this.props.recipe.prep_time_units,
        cook_time: this.props.recipe.cook_time,
        cook_time_units: this.props.recipe.cook_time_units,
        external_link: this.props.recipe.external_link,
      }
    } else {
        this.state = {
          newIngredient: '',
          newInstruction: '',
          collapseInstructions: false,
          collapseIngredients: false,
          id: null,
          name: null,
          author: null,
          ingredients: [],
          instructions: [],
          prep_time: null,
          prep_time_units: null,
          cook_time: null,
          cook_time_units: null,
        }
      }

    this.addIngredient = this.addIngredient.bind(this)
    this.addInstruction = this.addInstruction.bind(this)
    this.convertBlankStringToNull = this.convertBlankStringToNull.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputChangeIngredients = this.handleInputChangeIngredients.bind(this)
    this.handleInputChangeInstructions = this.handleInputChangeInstructions.bind(this)
    this.toggleInstructions = this.toggleInstructions.bind(this)
    this.toggleIngredients = this.toggleIngredients.bind(this)
    this.submitEditedRecipe = this.submitEditedRecipe.bind(this)
    this.submitCreatedRecipe = this.submitCreatedRecipe.bind(this)
    this.scrapeNewRecipe = this.scrapeNewRecipe.bind(this)
    this.deleteRecipe = this.deleteRecipe.bind(this)
    this.unitsConverter = this.unitsConverter.bind(this)
    this.starRecipe = this.starRecipe.bind(this)
  }

  unitsConverter(val) {
    return (val.toLowerCase().charAt(0) === 'm' ? 'minutes' : 'hours')
  }

  convertBlankStringToNull(val) {
    return (val === '' ? null : val)
  }

  componentDidMount() {
    if (this.props.mode === 'edit') {
      this.props.setRecipeEdit(this.submitEditedRecipe)
      this.props.setRecipeDelete(this.deleteRecipe)
      this.props.setStarRecipe(this.starRecipe)
    }
    if (this.props.mode === 'create') {
      this.props.setCreateRecipe(this.submitCreatedRecipe);
      this.props.setScrapeRecipe(this.scrapeNewRecipe)
    }
    this.setState( (state, props) => ({
      collapseInstructions: state.collapseInstructions,
      collapseIngredients: state.collapseIngredients
    }))
  }

  async submitCreatedRecipe() {
    let filteredIngredients = this.state.ingredients.filter( (val) => {
      return val !== ''
    })

    let filteredInstructions = this.state.instructions.filter( (val) => {
      return val !== ''
    })

    const payload = {
      name: this.state.name,
      author: this.state.author,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      prep_time: this.convertBlankStringToNull(this.state.prep_time),
      prep_time_units: this.convertBlankStringToNull(this.state.prep_time_units),
      cook_time: this.convertBlankStringToNull(this.state.cook_time),
      cook_time_units: this.convertBlankStringToNull(this.state.cook_time_units),
      external_link: this.state.external_link,
    }
    try {
      let updatedRecipeResponse = await RecipeService.create(payload)
      if (updatedRecipeResponse.status === 201) {
        const payload = {
          operation: "create",
          id: this.state.id
        }
        this.props.relayToast("success", "Recipe Created")
        this.props.onRecipesChangeTop(payload)
      }
    } catch (error) {
      this.props.relayToast("error", error.response.data.message)
    }
  }

  async starRecipe() {
    try {
      let starRecipeResponse = await RecipeService.star(this.props.recipe._id.$oid)
      if (starRecipeResponse.status === 200) {
        this.props.relayToast("success", "Recipe Starred")
        this.props.onRecipesStarredTop({"id": this.props.recipe._id.$oid})
      }
    } catch (error) {
      this.props.relayToast("error", error.response.data)
    }
  }

  async submitEditedRecipe() {
    let filteredIngredients = this.state.ingredients.filter( (val) => {
      return val !== ''
    })

    let filteredInstructions = this.state.instructions.filter( (val) => {
      return val !== ''
    })

    const payload = {
      name: this.state.name,
      author: this.state.author,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      prep_time: this.state.prep_time,
      prep_time_units: this.state.prep_time_units,
      cook_time: this.state.cook_time,
      cook_time_units: this.state.cook_time_units,
      external_link: this.state.external_link,
    }

    try {
      let updatedRecipeResponse = await RecipeService.update(this.state.id, payload)
      if (updatedRecipeResponse.status === 200) {
        const payload = {
          operation: "edit",
          id: this.state.id
        }
        this.props.relayToast("success", "Recipe Edited")
        this.props.onRecipesChangeTop(payload)
      }
    } catch (error) {
      this.props.relayToast("error", error.response.data.message)
    }
  }

  async deleteRecipe() {
    try {
      const result = await confirmService.show({
        title: 'Delete?',
        target: '#deleteButton'
      })
      if (result) {
        let updatedRecipeResponse = await RecipeService.delete(this.state.id)
        if (updatedRecipeResponse.status === 204) {
          const payload = {
            operation: "delete",
            id: this.state.id
          }
          this.props.relayToast("success", "Recipe Deleted")
          this.props.onRecipesChangeTop(payload)
        }
      }
    } catch (error) {
      this.props.relayToast("error", error.response.data.message)
    }
  }

  // TODO: wrap this is try catch block
  async scrapeNewRecipe() {
    try {
      const payload = {
        url: this.state.external_link
      }
      let scrapingResults = await ScrapingManifestService.scrape(payload)

      let cookTimeLocal = null
      let calculatedCookTimeUnits = null
      let prepTimeLocal = null
      let calculatedPrepTimeUnits = null

      this.setState({
        name: scrapingResults.data.name,
        author: scrapingResults.data.author,
        ingredients: scrapingResults.data.ingredients,
        instructions: scrapingResults.data.instructions,
        prep_time: prepTimeLocal,
        prep_time_units: calculatedPrepTimeUnits,
        cook_time: cookTimeLocal,
        cook_time_units: calculatedCookTimeUnits
      })
    } catch(error) {
      this.props.relayToast("error", error.response.data.message)
    }
  }

  toggleInstructions() {
    this.setState({ collapseInstructions: !this.state.collapseInstructions })
  }

  toggleIngredients() {
    this.setState({ collapseIngredients: !this.state.collapseIngredients })
  }

  addIngredient() {
    let newIngredients = this.state.ingredients
    if(this.state.newIngredient.length === 0){
      this.props.relayToast("error", "Cannot add blank ingredient")
      return
    }
    newIngredients.unshift(this.state.newIngredient)
    this.setState( (state, props) => ({
      ingredients: newIngredients,
      newIngredient: ''
    }))
  }

  addInstruction() {
    let newInstructions = this.state.instructions
    if(this.state.newInstruction.length === 0){
      this.props.relayToast("error", "Cannot add blank instruction")
      return
    }
    newInstructions.push(this.state.newInstruction)
    this.setState( (state, props) => ({
      instructions: newInstructions,
      newInstruction: ''
    }))
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleInputChangeIngredients(event) {
    const target = event.target
    const value = target.value
    const index = target.getAttribute('index')
    const newIngredients = this.state.ingredients.slice()
    newIngredients[index] = value
    this.setState({ingredients: newIngredients})
  }

  handleInputChangeInstructions(event) {
    const target = event.target
    const value = target.value
    const index = target.getAttribute('index')
    const newInstructions = this.state.instructions.slice()
    newInstructions[index] = value
    this.setState({instructions: newInstructions})
  }

  render() {
    return (
      <Form>
        <FormGroup>
          <label htmlFor="#name">Name</label>
          <FormInput name="name"
                     id="#name"
                     placeholder="Recipe Name"
                     value={this.state.name || ''}
                     onChange={this.handleInputChange}/>
        </FormGroup>
        <FormGroup>
          <label htmlFor="#author">Author</label>
          <FormInput name="author"
                     id="#author"
                     placeholder="Author"
                     value={this.state.author || ''}
                     onChange={this.handleInputChange}/>
        </FormGroup>
        <FormGroup>
          <label htmlFor="#externalLink">Extenal Link</label>
          <FormInput name="external_link"
                     id="#externalLink"
                     placeholder="External Link"
                     value={this.state.external_link || ''}
                     onChange={this.handleInputChange}/>
        </FormGroup>
        <div className="form-row">
          <FormGroup className="col">
            <label htmlFor="#prepTime">Prep Time</label>
            <FormInput name="prep_time"
                       id="#prepTime"
                       placeholder="Prep Time"
                       value={this.state.prep_time || ''}
                       onChange={this.handleInputChange}/>
          </FormGroup>
          <FormGroup className="col">
            <label htmlFor="#prepTimeUnits">Prep Time Units</label>
            <FormSelect name="prep_time_units"
                        size='sm'
                        id='#prepTimeUnits'
                        value={this.state.prep_time_units || ''}
                        onChange={this.handleInputChange}>
              <option value="">N/A</option>
              <option value="hours">Hours</option>
              <option value="minutes">Minutes</option>
            </FormSelect>
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col">
            <label htmlFor="#cookTime">Cook Time</label>
            <FormInput name="cook_time"
                       id="#cookTime"
                       placeholder="Cook Time"
                       value={this.state.cook_time || ''}
                       onChange={this.handleInputChange}/>
          </FormGroup>
          <FormGroup className="col">
            <label htmlFor="#cookTimeUnits">Cook Time Units</label>
            <FormSelect name='cook_time_units'
                        size='sm'
                        id='#cookTimeUnits'
                        value={this.state.cook_time_units || ''}
                        onChange={this.handleInputChange}>
              <option value="">N/A</option>
              <option value="hours">Hours</option>
              <option value="minutes">Minutes</option>
            </FormSelect>
          </FormGroup>
        </div>
        <FormGroup>
          <Button outline onClick={this.toggleIngredients}>Ingredients
            <FontAwesomeIcon className='ml-1' icon = { this.state.collapseIngredients ? faArrowUp : faArrowDown } />
          </Button>
          <Collapse open={ this.state.collapseIngredients }>
            <InputGroup className='mt-2 mb-1 w-50'>
              <FormInput placeholder= 'Add Ingredient' name='newIngredient' value={this.state.newIngredient} onChange={this.handleInputChange}/>
              <Button className='ml-1' theme="success" onClick={ () => { this.addIngredient() } }>
                <FontAwesomeIcon className='ml-1' icon={faPlus} />
              </Button>
            </InputGroup>
            <ListGroup>
              { this.state.ingredients.map( (ingredient, index) => (
                <FormInput className="mt-1 mb-1"
                            key={index}
                            index={index}
                            value={ingredient}
                            onChange={this.handleInputChangeIngredients}/>
              ))}
            </ListGroup>
          </Collapse>
        </FormGroup>
        <FormGroup>
          <Button outline onClick={this.toggleInstructions}>Instructions
            <FontAwesomeIcon className='ml-1' icon = { this.state.collapseInstructions ? faArrowUp : faArrowDown } />
          </Button>
          <Collapse open={ this.state.collapseInstructions }>
            <InputGroup className='mt-2 mb-1 w-50'>
              <FormInput placeholder= 'Add Instructions' name='newInstruction' value={this.state.newInstruction} onChange={this.handleInputChange}/>
              <Button className='ml-1' theme="success" onClick={ () => { this.addInstruction() } }>
                <FontAwesomeIcon className='ml-1' icon={faPlus} />
              </Button>
            </InputGroup>
            <ListGroup>
              { this.state.instructions.map( (instruction, index) => (
                <FormTextarea className="mt-1 mb-1"
                              key={index}
                              index={index}
                              value={instruction}
                              onChange={this.handleInputChangeInstructions}/>
              ))}
            </ListGroup>
          </Collapse>
        </FormGroup>
      </Form>
    )
  }
}
