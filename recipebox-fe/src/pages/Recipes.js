import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button,
         ButtonGroup,
         Container,
         Modal,
         ModalBody,
         ModalFooter,
         FormInput,
         Row,
         Col } from 'shards-react'

import RecipeContent from '../Components/RecipeContent'
import DynamicModalHeader from '../Components/DynamicModalHeader'
import RecipeService from '../store/services/RecipeService'
import UserService from '../store/services/UserService'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faStar, faListAlt, faList } from "@fortawesome/free-solid-svg-icons"

import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import LengthRenderer from '../Components/renderers/LengthRenderer'
import AdderModal from '../Components/AdderModal';

export default class Recipes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columnsDefs: [
        {headerName: 'Name', field: 'name', sortable: true, filter: true, resizable: true},
        {headerName: 'Author', field: 'author', sortable: true, filter: true, resizable: true},
        {headerName: '# of Ingredients', field: 'ingredients', sortable: true, filter: true, resizable: true, cellRenderer: 'lengthRenderer' },
        {headerName: '# of Instructions', field: 'instructions', sortable: true, filter: true, resizable: true, cellRenderer: 'lengthRenderer' },
        {headerName: 'Prep Time', field: 'prep_time', sortable: true, filter: true, resizable: true},
        {headerName: 'Cook Time', field: 'cook_time', sortable: true, filter: true, resizable: true},
      ],
      frameworkComponents: {
        lengthRenderer: LengthRenderer,
      },
      recipes: null,
      userData: null,
      activeRecipe: undefined,
      page: 1
    }
    this.handleQuickFilter = this.handleQuickFilter.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.viewRecipeDetails = this.viewRecipeDetails.bind(this)
    this.handleRecipeStar = this.handleRecipeStar.bind(this)
    this.displayToastNotification = this.displayToastNotification.bind(this)
    this.retrieveNextRecipePage = this.retrieveNextRecipePage.bind(this)
  }

  displayToastNotification(type, message) {
    if (type === "error") toast.error(message)
    else if (type === "success") toast.success(message)
    else {
      console.error('Umm we cannot send that message')
    }
  }

  handleQuickFilter(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.gridApi.setQuickFilter(value)
  }

  toggleModal() {
    this.setState({
      open: !this.state.open,
    });
  }

  handleRecipeStar() {
    this.toggleModal()
  }

  closeModal(event) {
    this.setState({
      activeRecipe: undefined
    })
    this.toggleModal()
  }

  viewRecipeDetails(event) {
    this.setState({
      activeRecipe: event.data
    })
    this.toggleModal()
  }

  async retrieveUserDetails() {
    try {
      let userDetailsReponse = await UserService.fetchUserOverview()
      if (userDetailsReponse) {
        this.setState({
          userData: userDetailsReponse.data,
        })
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  async retrieveRecipes() {
    try {
      let recipesResponse = await RecipeService.fetchAll(this.state.page)
      if (recipesResponse.status === 200) {
        this.setState({
          recipes: recipesResponse.data,
        })
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  async retrieveNextRecipePage() {
    this.setState( state => ({
      page: state.page + 1
    }), async () => {
      try {
        let recipesResponse = await RecipeService.fetchAll(this.state.page)
        if (recipesResponse.status === 200) {
          this.setState( state => ({
            recipes: recipesResponse.data.concat(state.recipes)
          }))
        }
      } catch (error) {
        if (error.response.status === 404) toast.error('You did it. You actually ran out of Recipes.')
        else {
          toast.error(error.response.data.message)
        }
      }
    })
  }

  componentDidMount() {
    this.retrieveRecipes()
    // This allows the page to be viewable without logging in
    if (localStorage.getItem('authToken')) {
      this.retrieveUserDetails()
    }
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered = params => {
    params.api.sizeColumnsToFit();
  }

  render() {
    let isloggedIn = localStorage.getItem('authToken')
    const { open } = this.state
    return (
      <Container className='mt-3'>
        <Row className='mb-1'>
          <Col>
            <FormInput size="sm"
                       name="filterValue"
                       id="#filterValue"
                       placeholder="Type to Search"
                       onChange={this.handleQuickFilter} />
          </Col>
          <Col>
            <Button theme='secondary' className='float-right' size='sm' onClick={this.retrieveNextRecipePage}>
              <span style={{"display": "inline-flex"}}>
                Load More
              </span>
              <FontAwesomeIcon className='ml-1' icon={faList} style={{"display": "inline-flex", "verticalAlign": "center"}}/>
            </Button>
          </Col>
        </Row>

        <Modal size="lg h-100"
               open={open}
               toggle={this.toggleModal}>
          <DynamicModalHeader recipe={this.state.activeRecipe}
                              userData={this.state.userData || { authored_recipes:[], starred_recipes:[] }}/>
          <ModalBody style={{
              "overflowY": "auto",
              "height": "65vh"
              }}>
            <RecipeContent recipe={this.state.activeRecipe}
                           mode = 'star'
                           setStarRecipe={starRecipe => this.starRecipeChild = starRecipe}
                           onRecipesStarredTop={this.handleRecipeStar}
                           relayToast={this.displayToastNotification}/>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup className='float-left'>
                <Button theme='warning' className='ml-1' onClick={ () => { this.toggleModal() } }>Close
                  <FontAwesomeIcon className='ml-1' icon={faTimes} />
                </Button>
                <Button theme='info' className='ml-1' onClick={ () => { this.togglePopoverChild() } }>Add to Shopping List
                  <FontAwesomeIcon className='ml-1' icon={faListAlt} />
                </Button>
                <Button theme='primary' className='ml-1' onClick={ () => this.starRecipeChild() }>Star
                  <FontAwesomeIcon className='ml-1' icon={faStar} />
                </Button>
              </ButtonGroup>
              <AdderModal recipe={this.state.activeRecipe}
                          setTogglePopover={togglePopover => this.togglePopoverChild = togglePopover}
                          relayToast={this.displayToastNotification}/>
          </ModalFooter>
        </Modal>
        <div className='ag-theme-balham w-100'
                 style={{
                  "height": "80vh"
                 }}>
          <AgGridReact
            columnDefs={this.state.columnsDefs}
            rowData={this.state.recipes}
            rowSelection='single'
            onGridReady={this.onGridReady}
            onRowDoubleClicked={this.viewRecipeDetails}
            onFirstDataRendered={this.onFirstDataRendered.bind(this)}
            frameworkComponents={this.state.frameworkComponents}
          />
        </div>
        <ToastContainer/>
      </Container>
    )
  }
}
