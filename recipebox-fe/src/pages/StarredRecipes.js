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
import UserService from '../store/services/UserService'
import RecipeService from '../store/services/RecipeService'
import confirmService from '../Components/confirmService'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faTimes, faListAlt } from "@fortawesome/free-solid-svg-icons"

import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import LengthRenderer from '../Components/renderers/LengthRenderer'
import AdderModal from '../Components/AdderModal'

export default class StarredRecipes extends React.Component {
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
      starredRecipes: null,
      userData: null,
      activeRecipe: undefined,
    }
    this.closeModal = this.closeModal.bind(this)
    this.displayToastNotification = this.displayToastNotification.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.loadRecipeDetails = this.loadRecipeDetails.bind(this)
    this.viewRecipeDetails = this.viewRecipeDetails.bind(this)
    this.unstar = this.unstar.bind(this)
    this.handleRecipeUnstar = this.handleRecipeUnstar.bind(this)
    this.handleQuickFilter = this.handleQuickFilter.bind(this)
  }

  toggleModal() {
    this.setState({
      open: !this.state.open,
    });
  }

  handleQuickFilter(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.gridApi.setQuickFilter(value)
  }

  displayToastNotification(type, message) {
    if (type === "error") toast.error(message)
    else if (type === "success") toast.success(message)
    else {
      console.error('Umm we cannot send that message')
    }
  }

  handleRecipeUnstar(payload) {
    const removedId = payload.id
    let newRecipes = this.state.starredRecipes.filter( item => item._id.$oid !== removedId )
    this.setState({
      starredRecipes: newRecipes
    }, () => {
      this.gridApi.setRowData(this.state.starredRecipes)
    })
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

  loadRecipeDetails(event) {
    this.setState({
      activeRecipe: event.data
    })
  }

  async retrieveStarredRecipes() {
    try {
      let starredRecipesResponse = await UserService.fetchUserData('starred-recipes')
      if (starredRecipesResponse.status === 200) {
        this.setState({
          starredRecipes: starredRecipesResponse.data,
        })
      }
    } catch (error) {
        toast.error(error.response.data.message)
      }
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

  async unstar() {
    const rowData = this.gridApi.getSelectedRows()
    // Get first row only
    const id = rowData[0]._id['$oid']
    try {
      const result = await confirmService.show({
        title: 'Unstar?',
        target: '#unstarButtonTop'
      })
      if (result) {
        let unStarRecipeResponse = await RecipeService.unStar(id)
        if (unStarRecipeResponse.status === 200) {
          let newRecipes = this.state.starredRecipes.filter( item => item._id.$oid !== id )
          this.setState({
            starredRecipes: newRecipes
          }, () => {
            this.gridApi.setRowData(this.state.starredRecipes)
          })
          toast.success("Recipe Unstarred")
        }
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  componentDidMount() {
    this.retrieveStarredRecipes()
    this.retrieveUserDetails()
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered = params => {
    params.api.sizeColumnsToFit();
  }

  render() {
    const { open, activeRecipe } = this.state
    return(
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
            <Button className='float-right' size='sm' disabled={!activeRecipe} id='unstarButtonTop' theme='danger' onClick={this.unstar}>Unstar
              <FontAwesomeIcon className='ml-1' icon={faStar} />
            </Button>
          </Col>
        </Row>

        <Modal size="lg h-100"
               open={open}
               toggle={this.toggleModal}>
          <DynamicModalHeader recipe={this.state.activeRecipe}
                              userData={this.state.userData}/>
          <ModalBody style={{
              "overflowY": "auto",
              "height": "65vh"
              }}>
            <RecipeContent recipe={this.state.activeRecipe}
                           mode = 'unstar'
                           setUnstarRecipe={unstarRecipe => this.unstarRecipeChild = unstarRecipe}
                           onRecipesStarredTop={this.handleRecipeUnstar}
                           relayToast={this.displayToastNotification}/>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup className='float-left'>
              <Button theme='warning' className='ml-1' onClick={ () => { this.toggleModal() } }>
                <FontAwesomeIcon className='ml-1' icon={faTimes} />
              </Button>
              <Button theme='info' className='ml-1' onClick={ () => { this.togglePopoverChild() } }>
                  <FontAwesomeIcon className='ml-1' icon={faListAlt} />
              </Button>
              <Button id='unstarButton' theme='primary' className='ml-1' onClick={ () => this.unstarRecipeChild() }>
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
            rowData={this.state.starredRecipes}
            rowSelection='single'
            onGridReady={this.onGridReady}
            onRowSelected={this.loadRecipeDetails}
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
