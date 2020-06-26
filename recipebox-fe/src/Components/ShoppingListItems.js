import React from 'react'

import { Button,
         ButtonGroup,
         Modal,
         ModalBody,
         ModalHeader,
         Form,
         FormInput,
         FormGroup,
         ListGroup,
         ListGroupItem,
         Container } from "shards-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons"

import confirmService from '../Components/confirmService'

export default class ShoppingListItems extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      activeIndex: '',
      activeValue: '',
    };
    this.toggleModal = this.toggleModal.bind(this)
    this.openModal = this.openModal.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentDidMount() {
    this.props.closeModal(this.toggleModal)
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  toggleModal() {
    this.setState({
      open: !this.state.open,
      activeIndex: '',
      activeValue: ''
    });
  }

  openModal(index, value){
    this.setState({
      open: !this.state.open,
      activeIndex: index,
      activeValue: value
    });
  }

  async handleDelete(index) {
    this.setState({
      activeIndex: index
    })
    const result = await confirmService.show({
      title: 'Delete?',
      target: `#deleteButtonSingleItem-${index}-${this.props.id}`
    })
    if(result) {
      const index = this.state.activeIndex
      this.props.onIngredientDelete(index)
    }
  }

  handleUpdate() {
    const payload = {
      index: this.state.activeIndex,
      newItem: this.state.activeValue
    }
    this.props.onIngredientUpdate(payload)
  }

  render() {
    const { open } = this.state
    return (
      <Container>
        <ListGroup flush small>
          { this.props.ingredients.map( (ingredient, index) => (
            <ListGroupItem className="mb-1" key={index}>
              { ingredient }
              <ButtonGroup className='ml-2 float-right'>
                <Button size='sm' theme='primary' onClick={ () => { this.openModal(index, ingredient) } }>
                  <FontAwesomeIcon className='ml-1' icon={faPencilAlt} />
                </Button>
                <Button size='sm' id={`deleteButtonSingleItem-${index}-${this.props.id}`} theme='danger' className='ml-1' onClick={ () => { this.handleDelete(index) } }>
                  <FontAwesomeIcon className='ml-1' icon={faTrash} />
                </Button>
              </ButtonGroup>
            </ListGroupItem>
          ))}
        </ListGroup>
        <Modal open={open} toggle={this.toggleModal}>
            <ModalHeader>Edit Ingredient</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <label htmlFor="#activeValue">Ingredient</label>
                <FormInput name="activeValue"  value={this.state.activeValue} onChange={this.handleInputChange}/>
              </FormGroup>
              <ButtonGroup className='float-right'>
                <Button className='w-20' theme='primary' onClick={ () => { this.handleUpdate() } }>
                  <FontAwesomeIcon className='ml-1' icon={faPencilAlt} />
                </Button>
                <Button theme='danger' className='ml-1' onClick={ () => { this.toggleModal() } }>
                  <FontAwesomeIcon className='ml-1' icon={faTimes} />
                </Button>
              </ButtonGroup>
            </Form>
          </ModalBody>
        </Modal>
      </Container>
    )
  }
}
