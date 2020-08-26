import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button,
         ButtonGroup,
         Container,
         Modal,
         ModalBody,
         ModalHeader,
         ModalFooter,
         FormInput,
         Row,
         Tooltip,
         Col } from 'shards-react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faListAlt,
         faTimes,
         faList,
         faPencilAlt,
         faPlus,
         faTrash,
         faCaravan,
         faStar } from "@fortawesome/free-solid-svg-icons"

import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import LengthRenderer from '../Components/renderers/LengthRenderer'

import UserService from '../store/services/UserService'
import RecipeService from '../store/services/RecipeService'

import RecipeForm from '../Components/forms/RecipeForm'
// import RecipeFormTwo from '../Components/forms/RecipeFormTwo'
import DynamicModalHeader from '../Components/DynamicModalHeader'
import AdderModal from '../Components/AdderModal'

export default class CreatedRecipes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      newOpen: false,
      activeRecipe: undefined,
      columnsDefs: [
        {headerName: 'Name', field: 'name', sortable: true, filter: true, resizable: true},
        {headerName: 'Author', field: 'author', sortable: true, filter: true, resizable: true},
        {headerName: '# of Ingredients', field: 'ingredients', sortable: true, filter: true, resizable: true, cellRenderer: 'lengthRenderer'},
        {headerName: '# of Instructions', field: 'instructions', sortable: true, filter: true, resizable: true, cellRenderer: 'lengthRenderer'},
        {headerName: 'Prep Time', field: 'prep_time', sortable: true, filter: true, resizable: true},
        {headerName: 'Cook Time', field: 'cook_time', sortable: true, filter: true, resizable: true},
      ],
      frameworkComponents: {
        lengthRenderer: LengthRenderer,
      },
      createdRecipes: null,
      userData: null,
      page: 1,
      scrapingTooltipOpen: false,
    }
    this.displayToastNotification = this.displayToastNotification.bind(this)
    this.retrieveCreatedRecipes = this.retrieveCreatedRecipes.bind(this)
    this.editRecipe = this.editRecipe.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.toggleNewModal = this.toggleNewModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleRecipeStar = this.handleRecipeStar.bind(this)
    this.handleRecipesChange = this.handleRecipesChange.bind(this)
    this.handleQuickFilter = this.handleQuickFilter.bind(this)
    this.retrievedNextCreatedRecipesPage = this.retrievedNextCreatedRecipesPage.bind(this)
    this.toggleScrapingTooltip = this.toggleScrapingTooltip.bind(this)
  }

  async retrieveCreatedRecipes() {
    try {
      let createdRecipesResponse = await UserService.fetchUserData('created-recipes', this.state.page)
      if (createdRecipesResponse.status === 200) {
        this.setState({
          createdRecipes: createdRecipesResponse.data,
        })
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  async retrievedNextCreatedRecipesPage() {
    this.setState( state => ({
      page: state.page + 1
    }), async () => {
      try {
        let createdRecipesResponse = await UserService.fetchUserData('created-recipes', this.state.page)
        if (createdRecipesResponse.status === 200) {
          this.setState( state => ({
            createdRecipes: createdRecipesResponse.data.concat(state.createdRecipes)
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

  async handleRecipesChange(payload) {
    if (payload.operation !== 'edit') {
      this.retrieveCreatedRecipes()
      if (payload.operation === 'create') this.toggleNewModal()
      if (payload.operation === 'delete') this.toggleModal()
    } else {
      const updatedRecipe = await RecipeService.fetchOne(payload.id)
      let index_to_replace = null
      this.state.createdRecipes.forEach( (item, idx) => {
        if(item._id.$oid === updatedRecipe.data._id.$oid){
          index_to_replace = idx
        }
      })

      let copyCreatedRecipes = this.state.createdRecipes
      copyCreatedRecipes[index_to_replace] = updatedRecipe.data

      this.setState({
        createdRecipes: copyCreatedRecipes
      }, () => {
        this.gridApi.setRowData(this.state.createdRecipes)
      })
      this.toggleModal()
    }
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

  editRecipe(event) {
    this.setState({
      activeRecipe: event.data
    })
    this.toggleModal()
  }

  handleRecipeStar() {
    this.toggleModal()
  }

  toggleModal() {
    this.setState({
      open: !this.state.open,
    })
  }

  toggleNewModal() {
    this.setState({
      newOpen: !this.state.newOpen,
    })
  }

  toggleScrapingTooltip() {
    this.setState({
      scrapingTooltipOpen: !this.state.scrapingTooltipOpen
    });
  }

  closeModal(event) {
    this.setState({
      activeRecipe: undefined
    })
    this.toggleModal()
  }

  async componentDidMount() {
    this.retrieveCreatedRecipes()
    this.retrieveUserDetails()
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered = params => {
    params.api.sizeColumnsToFit();
  };

  render() {
    const { open, newOpen } = this.state
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
            <Button theme='secondary' className='float-right ml-1' size='sm' onClick={this.retrievedNextCreatedRecipesPage}>Load More
                <FontAwesomeIcon className='ml-1' icon={faList} />
            </Button>
            <Button className='float-right reponsive-margin' size='sm' onClick={this.toggleNewModal}>Add
                <FontAwesomeIcon className='ml-1' icon={faPlus} />
            </Button>
          </Col>
        </Row>

        {/*New Modal  */}
        <Modal size="lg"
               open={newOpen}
               toggle={this.toggleNewModal}>
          <ModalHeader>New Recipe</ModalHeader>
          <ModalBody style={{
              "overflowY": "auto",
              "height": "65vh"
              }}>
            <RecipeForm mode='create'
                        setCreateRecipe={createRecipe => this.createRecipeChild = createRecipe}
                        setScrapeRecipe={scrapeRecipe => this.scrapeRecipeChild = scrapeRecipe}
                        onRecipesChangeTop={this.handleRecipesChange}
                        relayToast={this.displayToastNotification}/>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup className='float-left'>
              <Button theme='warning' className='ml-1' onClick={ () => { this.toggleNewModal() } }>Close
                <FontAwesomeIcon className='ml-1' icon={faTimes} />
              </Button>
              <Tooltip open={this.state.scrapingTooltipOpen}
                       target="#scrapingButton"
                       toggle={this.toggleScrapingTooltip}>
                Attempt to automatially retrieve the recipe specified at External Link and load it into the form.
              </Tooltip>
              <Button id='scrapingButton' theme='info' className='ml-1' onClick={ () => { this.scrapeRecipeChild() } }>Scrape
                <FontAwesomeIcon className='ml-1' icon={faCaravan} />
              </Button>
              <Button theme='primary' className='ml-1' onClick={ () => this.createRecipeChild() }>Save
                <FontAwesomeIcon className='ml-1' icon={faPencilAlt} />
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </Modal>

        {/* Edit Modal */}
        <Modal size="lg"
               open={open}
               toggle={this.toggleModal}>
          <DynamicModalHeader recipe={this.state.activeRecipe}
                              userData={this.state.userData}/>
          <ModalBody style={{
              "overflowY": "auto",
              "height": "65vh"
              }}>
            <RecipeForm mode='edit'
                        recipe={this.state.activeRecipe}
                        setRecipeEdit={recipeEdit => this.recipeEditChild = recipeEdit}
                        setStarRecipe={starRecipe => this.starRecipeChild = starRecipe}
                        setRecipeDelete={recipeDelete => this.recipeDeleteChild = recipeDelete}
                        onRecipesChangeTop={this.handleRecipesChange}
                        onRecipesStarredTop={this.handleRecipeStar}
                        relayToast={this.displayToastNotification}/>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup className='mt-auto'>
              <Button size='sm' theme='warning' className='ml-1' onClick={ () => { this.toggleModal() } }>Close
                <FontAwesomeIcon className='ml-1' icon={faTimes} />
              </Button>
              <Button size='sm' id='deleteButton' theme='danger' className='ml-1' onClick={ () => { this.recipeDeleteChild() } }>Delete
                <FontAwesomeIcon className='ml-1' icon={faTrash} />
              </Button>
              <Button size='sm' theme='secondary' className='ml-1' onClick={ () => this.starRecipeChild() }>Star
                  <FontAwesomeIcon className='ml-1' icon={faStar} />
                </Button>
              <Button size='sm' theme='info' className='ml-1' onClick={ () => { this.togglePopoverChild() } }>Add to Shopping List
                  <FontAwesomeIcon className='ml-1' icon={faListAlt} />
              </Button>
              <Button size='sm' theme='primary' className='ml-1' onClick={ () => this.recipeEditChild() }>Save
                <FontAwesomeIcon className='ml-1' icon={faPencilAlt} />
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
            rowData={this.state.createdRecipes}
            rowSelection='single'
            onGridReady={this.onGridReady}
            onRowDoubleClicked={this.editRecipe}
            onFirstDataRendered={this.onFirstDataRendered.bind(this)}
            frameworkComponents={this.state.frameworkComponents}
          />
        </div>
        <ToastContainer/>
      </Container>
    )
  }
}
