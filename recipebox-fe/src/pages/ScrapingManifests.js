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
         Col } from 'shards-react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faPencilAlt, faPlus, faTrash, faList } from "@fortawesome/free-solid-svg-icons"


import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

import UserService from '../store/services/UserService'
import ScrapingManifestService from '../store/services/ScrapingManifestService'
import ScrapingManifestForm from '../Components/forms/ScrapingManifestForm'


export default class ScrapingManifests extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeManifest: {
        domain: null
      },
      editModalOpen: false,
      newModalOpen: false,
      columnsDefs: [
        {headerName: 'Domain', field: 'domain', sortable: true, filter: true, resizable: true},
      ],
      createdManifests: null,
      page: 1
    }
    this.displayToastNotification = this.displayToastNotification.bind(this)
    this.toggleNewModal = this.toggleNewModal.bind(this)
    this.toggleEditModal = this.toggleEditModal.bind(this)
    this.viewSmanifestDetails = this.viewSmanifestDetails.bind(this)
    this.retrieveCreatedManifests = this.retrieveCreatedManifests.bind(this)
    this.handleSmanifestChange = this.handleSmanifestChange.bind(this)
    this.handleQuickFilter = this.handleQuickFilter.bind(this)
    this.retrieveNextSmanifestPage = this.retrieveNextSmanifestPage.bind(this)
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

  async componentDidMount() {
    await this.retrieveCreatedManifests()
  }

  async retrieveCreatedManifests() {
    try {
      let createdManifestsResponse = await UserService.fetchUserData('created-manifests', this.state.page)
      if (createdManifestsResponse.status === 200) {
        this.setState({
          createdManifests: createdManifestsResponse.data,
        })
      }
    } catch (error) {
        toast.error(error.response.data.message)
    }
  }

  async retrieveNextSmanifestPage() {
    this.setState( state => ({
      page: state.page + 1
    }), async () => {
      try {
        let createdManifestsResponse = await UserService.fetchUserData('created-manifests', this.state.page)
        if (createdManifestsResponse.status === 200) {
          this.setState( state => ({
            recipes: createdManifestsResponse.data.concat(state.createdManifests)
          }))
        }
      } catch (error) {
        if (error.response.status === 404) toast.error('No additional manifests')
        else {
          toast.error(error.response.data.message)
        }
      }
    })
  }

  viewSmanifestDetails(event) {
    this.setState({
      activeManifest: event.data
    })
    this.toggleEditModal()
  }

  toggleNewModal() {
    this.setState({
      newModalOpen: !this.state.newModalOpen,
    })
  }

  toggleEditModal() {
    this.setState({
      editModalOpen: !this.state.editModalOpen,
    })
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered = params => {
    params.api.sizeColumnsToFit();
  }

  async handleSmanifestChange(payload) {
    if (payload.operation !== 'edit') {
      this.retrieveCreatedManifests()
      if (payload.operation === 'create') this.toggleNewModal()
      if (payload.operation === 'delete') this.toggleEditModal()
    } else {
      const updatedManifest = await ScrapingManifestService.fetchOne(payload.id)
      let index_to_replace = null
      this.state.createdManifests.forEach( (item, idx) => {
        if(item._id.$oid === updatedManifest.data._id.$oid){
          index_to_replace = idx
        }
      })

      let copyCreatedManifests = this.state.createdManifests
      copyCreatedManifests[index_to_replace] = updatedManifest.data
      this.setState({
        createdManifests: copyCreatedManifests
      }, () => {
        this.gridApi.setRowData(this.state.createdManifests)
      })
      this.toggleEditModal()
    }
  }

  render() {
    const { editModalOpen, newModalOpen } = this.state
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
            <Button theme='secondary' className='float-right ml-1' size='sm' onClick={this.retrieveNextSmanifestPage}>
              <span style={{"display": "inline-flex"}}>
                Load More
              </span>
              <FontAwesomeIcon className='ml-1' icon={faList} style={{"display": "inline-flex", "verticalAlign": "center"}}/>
            </Button>
            <Button className='float-right reponsive-margin' size='sm' onClick={this.toggleNewModal}>Add
              <FontAwesomeIcon className='ml-1' icon={faPlus} />
            </Button>
          </Col>
        </Row>
        {/* New Modal */}
        <Modal size="lg"
               open={newModalOpen}
               toggle={this.toggleNewModal}>
          <ModalHeader>New Scraping Manifest</ModalHeader>
          <ModalBody style={{
              "overflowY": "auto",
              "height": "65vh"
              }}>
            <ScrapingManifestForm mode='create'
                                  setCreateSmanifest={createSmanifest => this.createSmanifestChild = createSmanifest}
                                  onSmanifestChangeTop={this.handleSmanifestChange}
                                  relayToast={this.displayToastNotification}/>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup className='float-left'>
              <Button theme='warning' className='ml-1' onClick={ () => { this.toggleNewModal() } }>Close
                <FontAwesomeIcon className='ml-1' icon={faTimes} />
              </Button>
              <Button theme='primary' className='ml-1' onClick={ () => this.createSmanifestChild() }>Save
                <FontAwesomeIcon className='ml-1' icon={faPencilAlt} />
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </Modal>

        {/* Edit Modal */}
        <Modal size="lg"
               open={editModalOpen}
               toggle={this.toggleEditModal}>
          <ModalHeader>{this.state.activeManifest.domain || ''} Manifest</ModalHeader>
          <ModalBody style={{
              "overflowY": "auto",
              "height": "65vh"
              }}>
            <ScrapingManifestForm mode='edit'
                                  smanifest={this.state.activeManifest}
                                  setEditSmanifest={editSmanifest => this.editSmanifestChild = editSmanifest}
                                  setDeleteSmanifest={deleteSmanifest => this.deleteSmanifestChild = deleteSmanifest}
                                  onSmanifestChangeTop={this.handleSmanifestChange}
                                  relayToast={this.displayToastNotification}/>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup className='float-left'>
              <Button theme='warning' className='ml-1' onClick={ () => { this.toggleEditModal() } }>Close
                <FontAwesomeIcon className='ml-1' icon={faTimes} />
              </Button>
              <Button id='deleteSmanifestButton' theme='danger' className='ml-1' onClick={ () => { this.deleteSmanifestChild() } }>Delete
                <FontAwesomeIcon className='ml-1' icon={faTrash} />
              </Button>
              <Button theme='primary' className='ml-1' onClick={ () => { this.editSmanifestChild() } }>Save
                <FontAwesomeIcon className='ml-1' icon={faPencilAlt} />
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </Modal>
        <div className='ag-theme-balham w-100'
                 style={{
                  "height": "80vh"
                 }}>
          <AgGridReact
            columnDefs={this.state.columnsDefs}
            rowData={this.state.createdManifests}
            rowSelection='single'
            onGridReady={this.onGridReady}
            onRowDoubleClicked={this.viewSmanifestDetails}
            onFirstDataRendered={this.onFirstDataRendered.bind(this)}
            frameworkComponents={this.state.frameworkComponents}
          />
        </div>
        <ToastContainer/>
      </Container>
    )
  }

}
