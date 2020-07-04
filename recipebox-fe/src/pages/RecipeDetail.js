import React from 'react'

import RecipeService from '../store/services/RecipeService'
import { toast } from 'react-toastify'
import { Container } from 'shards-react'

export default class RecipeDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recipe: {
        name: '',
        external_link: '',
        author: '',
        cook_time: '',
        prep_time: '',
        ingredients: [],
        instructions: []
      }
    }
  }

  async componentDidMount() {
    try {
      let recipeResponse = await RecipeService.fetchOne(this.props.id)
      if (recipeResponse.status === 200) {
        this.setState({
          recipe: recipeResponse.data,
        })
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  render() {
    const { recipe } = this.state
    return (
      <Container className='mt-3'>
        <h3>
          <a href={recipe.external_link}>
            { recipe.name }
          </a>
        </h3>
        <h5>Author: { recipe.author }</h5>
        <p className='mb-1'>Cook Time: { recipe.cook_time }</p>
        <p className='mb-1'>Prep Time: { recipe.prep_time }</p>
        <p className='mb-1'>Ingredients</p>
        <ul>
          { recipe.ingredients.map( (ingredient, index)  => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <p className='mb-1'>Instructions</p>
        <ol>
          { recipe.instructions.map( (instruction, index)   => (
            <li key={index}>{instruction}</li>
            ))}
        </ol>
      </Container>
    )
  }
}
