import React from 'react'

import {
  Form,
  FormInput,
  FormGroup } from 'shards-react'

import ShoppingListService from '../../store/services/ShoppingListService'

export default class ShoppingListForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shoppingListName: null
    }
    this.createNewShoppingList = this.createNewShoppingList.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentDidMount() {
    this.props.setCreateShoppingList(this.createNewShoppingList);
  }

  async createNewShoppingList() {
    const payload = {
      name: this.state.shoppingListName
    }

    try {
      let createList = await ShoppingListService.create(payload)
      if (createList.status === 201) {
        this.props.relayToast("success", "Shopping List Created")
        this.props.onShoppingListChangeTop({})
      }
    } catch (error) {
      this.props.relayToast("error", error.response.data.message)
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <Form>
        <FormGroup>
          <label htmlFor="#shoppingListName">Shopping List Name</label>
          <FormInput name="shoppingListName"
                     id="#shoppingListName"
                     placeholder="Shopping List Name"
                     value={this.state.shoppingListName || ''}
                     onChange={this.handleInputChange}/>
        </FormGroup>
      </Form>
    )
  }
}


