import React from 'react'

import { Button,
         ButtonToolbar,
         ButtonGroup,
         Container,
         Progress } from 'shards-react'

import ShoppingListService from '../store/services/ShoppingListService'
import RecipeService from '../store/services/RecipeService'

export default class ShoppingListView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      displayMode: 'default',
      created: null,
      ingredients: null,
      addedRecipes: null,
      loading: true,
    }
    this.fetchRecipeName = this.fetchRecipeName.bind(this)
    this.updateDisplayMode = this.updateDisplayMode.bind(this)
  }

  async componentDidMount() {
    const shoppingListData =  await ShoppingListService.fetchOne(this.props.shoppingListId)
    const recipeNames = await Promise.all(shoppingListData.data.added_recipes.map(item => this.fetchRecipeName(item.$oid)))
    const recipeIds = await Promise.all(shoppingListData.data.added_recipes.map(item => item.$oid))
    this.setState({
      name: shoppingListData.data.name,
      created: shoppingListData.data.created,
      ingredients: shoppingListData.data.ingredients,
      recipeIds: recipeIds,
      addedRecipes: recipeNames,
      byShoppingList: [],
      byShoppingListExtras: [],
      loading: false
    })
  }

  async fetchRecipeName(id) {
    try {
      let recipeResponse = await RecipeService.fetchOne(id)
      if (recipeResponse.status === 200) {
        return recipeResponse.data.name
      }
    } catch(error) {
      console.error(error)
    }
  }

  async updateDisplayMode(mode) {
    this.setState({
      displayMode: mode
    })
    if (mode === 'recipe') this.shoppingListByRecipeFormat()
  }

  async shoppingListByRecipeFormat() {
    this.setState({
      loading: true
    })
    let byShoppingListPayload = []
    let byShoppingListExtrasPayload = []
    // temporary structure to track all ingredients that we assign to a shopping list
    let tempShoppingListTracker = []
    for (let recipeId of this.state.recipeIds) {
      try {
        const singleRecipe = await RecipeService.fetchOne(recipeId)
        if (singleRecipe.status === 200) {
          let recipeName = singleRecipe.data.name
          let ingredientsList = singleRecipe.data.ingredients
          let retainedIngredients = []
          ingredientsList.forEach(ing => {
            if (this.state.ingredients.includes(ing)) {
              retainedIngredients.push(ing)
              tempShoppingListTracker.push(ing)
            }
          });
          byShoppingListPayload.push({"name":recipeName, "ingredients":retainedIngredients})
        }
      } catch (error) {
        console.error(error)
      }
      this.setState({
        byShoppingList: byShoppingListPayload
      })
    }

    for (let ing of this.state.ingredients) {
      if (!tempShoppingListTracker.includes(ing)) {
        byShoppingListExtrasPayload.push(ing)
      }
    }
    this.setState({
      byShoppingListExtras: byShoppingListExtrasPayload,
      loading: false
    })
  }

  render() {
    let { displayMode, loading } = this.state
    return (
      <Container>
        <h3 className='mt-2'>{this.state.name}</h3>
        <ButtonToolbar className='mt-2 mb-2'>
          <ButtonGroup size="sm">
            {displayMode==='default'
              ? <Button theme="info" onClick={ () => {this.updateDisplayMode('default')} }>Default</Button>
              : <Button outline theme="info" onClick={ () => {this.updateDisplayMode('default')} }>Default</Button>
            }
            {displayMode==='recipe'
              ? <Button theme="info" onClick={ () => {this.updateDisplayMode('recipe')} }>By recipe</Button>
              : <Button outline theme="info" onClick={ () => {this.updateDisplayMode('recipe')} }>By recipe</Button>
            }
            {displayMode==='ingredient'
              ? <Button theme="info" onClick={ () => {this.updateDisplayMode('ingredient')} }>By ingredient</Button>
              : <Button outline theme="info" onClick={ () => {this.updateDisplayMode('ingredient')} }>By ingredient</Button>
            }
          </ButtonGroup>
        </ButtonToolbar>
        {displayMode === 'default' && !loading &&
          <span>
            <h4>Recipes</h4>
            <ul>
            { (this.state.addedRecipes || []).map( (recipe, index) => (
              <li key={index}>
                <a href={`/recipes/${this.state.recipeIds[index]}`}>
                  {recipe}
                </a>
              </li>
            ))}
            </ul>
            <h4>Items</h4>
            <ul>
              { (this.state.ingredients || []).map( (ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </span>
        }
        {displayMode === 'default' && loading &&
          <Progress className='w-50' theme="primary" value={100} />
        }
        {displayMode === 'recipe' && !loading &&
          <span>
            { (this.state.byShoppingList || []).map( (recipe, index) => (
              <span key={index}>
                <a key={index} href={`/recipes/${this.state.recipeIds[index]}`}>
                  <h4 key={recipe}>{recipe.name}</h4>
                </a>
                <ul>
                  { (recipe.ingredients || []).map( (ingredient, index) => (
                    <li key={index+'sub'}>{ingredient}</li>
                  ))}
                </ul>
              </span>
            ))}
            <span>
              { this.state.byShoppingListExtras.length > 0 &&
              <h4>Extras</h4>
              }
              <ul>
              { (this.state.byShoppingListExtras || []).map( (ing, index) => (
                <li key={index}>{ing}</li>
              ))}
              </ul>
            </span>
          </span>
        }
        {displayMode === 'recipe' && loading &&
          <Progress className='w-50' theme="primary" value={100} />
        }
        {displayMode === 'ingredient' &&
          <span>
            <p>TODO</p>
          </span>
        }
      </Container>
    )
  }
}
