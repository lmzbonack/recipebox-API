import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import Autosuggest from 'react-autosuggest'
import RecipeContent from '../Components/RecipeContent'
import DynamicModalHeader from '../Components/DynamicModalHeader'

import RecipeService from '../store/services/RecipeService'
import UserService from '../store/services/UserService'

import { Button,
         ButtonGroup,
         Container,
         Modal,
         ModalBody,
         ModalFooter } from 'shards-react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes, faStar, faListAlt } from "@fortawesome/free-solid-svg-icons"
import AdderModal from '../Components/AdderModal';
const debounce = require('lodash.debounce');

async function getSearchData(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  if (escapedValue === '') {
    return [];
  }
  const result = await RecipeService.search(escapedValue)
  return result.data
}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderSuggestion(suggestion) {
  let site = suggestion.external_link.split('.')[1]
  return (
  <span>{suggestion.name}-{site}</span>
  );
}

export default class SearchAutoSuggest extends React.Component {
  constructor() {
    super()

    this.state = {
      value: '',
      suggestions: [],
      isLoading: false,
      open: false,
      activeRecipe: [],
      userData: null,
    };
    this.closeModal = this.closeModal.bind(this)
    this.displayToastNotification = this.displayToastNotification.bind(this)
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.handleRecipeStar = this.handleRecipeStar.bind(this)
    this.debouncedLoadSuggestions = debounce(this.loadSuggestions, 500); // 1000ms is chosen for demo purposes only.
  }

  componentDidMount() {
    if (localStorage.getItem('authToken')) {
      this.retrieveUserDetails()
    }
  }

  displayToastNotification(type, message) {
    if (type === "error") toast.error(message)
    else if (type === "success") toast.success(message)
    else {
      console.error('Umm we cannot send that message')
    }
  }

  async retrieveUserDetails() {
    try {
      let userDetailsReponse = await UserService.fetchUserOverview()
      if (userDetailsReponse) {
        this.setState({
          userData: userDetailsReponse.data,
          error: ''
        })
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  async loadSuggestions(value) {
    this.setState({
      isLoading: true
    });

    const suggestions = await getSearchData(value);

    if (value === this.state.value) {
      this.setState({
        isLoading: false,
        suggestions
      });
    } else { // Ignore suggestions if input value changed
      this.setState({
        isLoading: false
      });
    }
  }

  getSuggestionValue(suggestion) {
    // Set the state for the modal and open it
    this.setState({
      activeRecipe: suggestion
    })
    this.toggleModal()
    return suggestion.name;
  }


  handleRecipeStar() {
    this.toggleModal()
  }

  toggleModal() {
    this.setState({
      open: !this.state.open,
    });
  }

  closeModal(event) {
    this.setState({
      activeRecipe: undefined
    })
    this.toggleModal()
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.debouncedLoadSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions, isLoading, open } = this.state;
    const inputProps = {
      placeholder: "Type to search",
      value,
      onChange: this.onChange
    };
    const status = (isLoading ? 'Loading...' : 'Waiting for input');

    return (
      <Container>
        <div className="status">
          <strong>Status:</strong> {status}
        </div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps} />

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
        <ToastContainer/>
      </Container>
    );
  }
}
