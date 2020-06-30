import React from 'react'

import { Container } from 'shards-react'

import RecipeService from '../store/services/RecipeService'
import confirmService from '../Components/confirmService'

export default class RecipeContent extends React.Component {
  constructor(props) {
    super(props)
    this.starRecipe = this.starRecipe.bind(this)
    this.unstarRecipe = this.unstarRecipe.bind(this)
  }

  componentDidMount() {
    if (this.props.mode === 'star') this.props.setStarRecipe(this.starRecipe)
    if (this.props.mode === 'unstar') this.props.setUnstarRecipe(this.unstarRecipe)
  }

  async starRecipe() {
    if (localStorage.getItem('authToken')) {
      try {
        let starRecipeResponse = await RecipeService.star(this.props.recipe._id.$oid)
        if (starRecipeResponse.status === 200) {
          this.props.relayToast("success", "Recipe Starred")
          this.props.onRecipesStarredTop({"id": this.props.recipe._id.$oid})
        }
      } catch (error) {
        this.props.relayToast("error", error.response.data)
      }
    } else {
      this.props.relayToast("error", "Please sign in to do this")
    }
  }

  async unstarRecipe() {
    try {
      const result = await confirmService.show({
        title: 'Unstar?',
        target: '#unstarButton'
      })
      if (result) {
        let unStarRecipeResponse = await RecipeService.unStar(this.props.recipe._id.$oid)
        if (unStarRecipeResponse.status === 200) {
          this.props.relayToast("success", "Recipe Unstarred")
          this.props.onRecipesStarredTop({"id": this.props.recipe._id.$oid})
        }
      }
    } catch (error) {
      this.props.relayToast("error", error.response.data)
    }
  }

  render() {
    return (
      <Container>
        <p className='mb-1'>Author: { this.props.recipe.author }</p>
        <p className='mb-1'>Prep Time: { this.props.recipe.prep_time }</p>
        <p className='mb-1'>Cook Time: { this.props.recipe.cook_time }</p>
        <p className='mb-1'>Ingredients</p>
        <ul>
          { this.props.recipe.ingredients.map( (ingredient, index)  => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <p className='mb-1'>Instructions</p>
        <ol>
          { this.props.recipe.instructions.map( (instruction, index)   => (
            <li key={index}>{instruction}</li>
            ))}
        </ol>
      </Container>
    )
  }
}
