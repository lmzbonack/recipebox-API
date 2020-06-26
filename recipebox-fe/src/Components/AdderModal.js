import React from "react"
import { Button,
         ButtonGroup,
         FormGroup,
         FormSelect,
         Modal,
         ModalBody,
         ModalHeader,
         ModalFooter} from "shards-react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons"

import UserService from '../store/services/UserService'
import ShoppingListService from '../store/services/ShoppingListService'

export default class AdderPopover extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      shoppingListSelection: '',
      shoppingListOptions: []
    }
    this.fetchShoppingLists = this.fetchShoppingLists.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.addToShoppingList = this.addToShoppingList.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  async componentDidMount() {
    await this.fetchShoppingLists()
    this.props.setTogglePopover(this.toggle)
  }

  async addToShoppingList() {
    const payload = {
      recipe_id: this.props.recipe._id.$oid
    }
    try {
      let shoppingListAdderResponse = await ShoppingListService.updateWithRecipe(this.state.shoppingListSelection, payload)
      if (shoppingListAdderResponse.status === 200) {
        this.props.relayToast("success", "Recipe Added")
        this.toggle()
      }
    } catch (error) {
      this.props.relayToast("error", error.response.data)
    }
  }

  async fetchShoppingLists() {
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
          this.setState({
            shoppingListOptions: listOptions,
            shoppingListSelection: listOptions[0].id
          })
        });
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
    const { open, shoppingListOptions } = this.state
    let lister = shoppingListOptions.length > 0
        && shoppingListOptions.map( (value, index) => {
          return (
            <option key={index} value={value.id}>{value.name}</option>
          )
        }, this)
    return (
      <div>
        <Modal placement="bottom"
               open={open}
               toggle={this.toggle}>
          <ModalHeader>Add {this.props.recipe.name} to shopping list</ModalHeader>
          <ModalBody>
            <FormGroup>
              <label htmlFor="#shoppingListSelection">Shopping List</label>
              <FormSelect name='shoppingListSelection'
                          size='sm'
                          id='#shoppingListSelection'
                          value={this.state.shoppingListSelection}
                          onChange={this.handleInputChange}>
                          {lister}
              </FormSelect>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup className='float-left'>
              <Button theme='danger' className='ml-1' onClick={ () => { this.toggle() } }>
                <FontAwesomeIcon className='ml-1' icon={faTimes} />
              </Button>
              <Button className='ml-1'
                      theme="secondary"
                      onClick={ () => { this.addToShoppingList() } }>
                <FontAwesomeIcon className='ml-1' icon={faPencilAlt} />
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
