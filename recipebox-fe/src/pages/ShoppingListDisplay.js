import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card,
         CardHeader,
         CardBody,
         CardFooter,
         Container,
         Row,
         Button } from 'shards-react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

import { navigate } from "@reach/router"

import UserService from '../store/services/UserService'

function navigateToDisplay(listId) {
  navigate(`/shopping-list/${listId}`)
}

export default class ShoppingListDisplay extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shoppingLists: [],
    }
  }

  componentDidMount() {
    this.retrieveShoppingLists()
 }

  async retrieveShoppingLists() {
    try {
      let shoppingListResponse = await UserService.fetchUserData('shopping-list')
      if (shoppingListResponse.status === 200) {
        this.setState({
          shoppingLists: shoppingListResponse.data,
        })
      }
    } catch (error) {
        toast.error(error.response.data.message)
    }
  }

  render() {
    return (
      <Container>
        <Row>
            { this.state.shoppingLists.map( value => {
              return(
              <Card className="m-3" style={{ width: "200px" }} key={value._id.$oid}>
                <CardHeader>{ value.name }</CardHeader>
                <CardBody>
                  <p className="m-0">Recipes: {value.added_recipes.length}</p>
                  <p className="mt-1">Ingredients: {value.ingredients.length}</p>
                </CardBody>
                <CardFooter>
                  <Button size='sm' className='float-right' onClick={ () => {navigateToDisplay(value._id.$oid)}}>View
                    <FontAwesomeIcon className='ml-1' icon={faArrowRight} />
                  </Button>
                </CardFooter>
              </Card>
              )
            })}
        </Row>
       <ToastContainer/>
      </Container>
    )
   }
}
