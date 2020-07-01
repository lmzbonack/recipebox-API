import React from "react";
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse
} from "shards-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

export default class NavRecipe extends React.Component {
  constructor(props) {
    super(props);

    this.toggleRecipeDropdown = this.toggleRecipeDropdown.bind(this)
    this.toggleProfileDropdown = this.toggleProfileDropdown.bind(this)
    this.toggleShoppingListDropdown = this.toggleShoppingListDropdown.bind(this)
    this.toggleNavbar = this.toggleNavbar.bind(this);

    this.state = {
      recipeDropdownOpen: false,
      profileDropdownOpen: false,
      shoppingListDropdownOpen: false,
      collapseOpen: false,
      loggedIn: false
    };
  }

  componentDidMount() {
    if(this.props.loggedIn){
      this.setState({
        loggedIn: true
      })
    }
  }

  toggleRecipeDropdown() {
    this.setState({
      ...this.state,
      ...{
        recipeDropdownOpen: !this.state.recipeDropdownOpen
      }
    });
  }

  toggleProfileDropdown() {
    this.setState({
      ...this.state,
      ...{
        profileDropdownOpen: !this.state.profileDropdownOpen
      }
    });
  }

  toggleShoppingListDropdown() {
    this.setState({
      ...this.state,
      ...{
        shoppingListDropdownOpen: !this.state.shoppingListDropdownOpen
      }
    });
  }

  toggleNavbar() {
    this.setState({
      ...this.state,
      ...{
        collapseOpen: !this.state.collapseOpen
      }
    });
  }

  render() {
    let isloggedIn = this.state.loggedIn
    return (
      <Navbar theme="light" expand="md">
        <NavbarBrand href="/recipes">Recipe Box</NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar}>
          <FontAwesomeIcon className='ml-1' icon={faBars} />
        </NavbarToggler>

        <Collapse open={this.state.collapseOpen} navbar>
          <Nav navbar>
            <Dropdown
              open={this.state.recipeDropdownOpen}
              toggle={this.toggleRecipeDropdown}
            >
              <DropdownToggle nav caret>
                Recipes
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href='/recipes'>What's New?</DropdownItem>
                <DropdownItem href='/search'>Search</DropdownItem>
                {isloggedIn !== false &&
                <span>
                  <DropdownItem href='/created-recipes'>Created Recipes</DropdownItem>
                  <DropdownItem href='/starred-recipes'>Starred Recipes</DropdownItem>
                </span>
                }
              </DropdownMenu>
            </Dropdown>

            {isloggedIn !== false &&
            <Dropdown
              open={this.state.shoppingListDropdownOpen}
              toggle={this.toggleShoppingListDropdown}
            >
              <DropdownToggle nav caret>
                Shopping Lists
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href='/shopping-list'>Manage</DropdownItem>
                <DropdownItem href='/shopping-list-display'>View</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            }

            {isloggedIn !== false &&
            <Dropdown
              open={this.state.profileDropdownOpen}
              toggle={this.toggleProfileDropdown}
            >
              <DropdownToggle nav caret>
                Profile
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href='/created-manifests'>Scraping Manifests</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            }
          </Nav>

          <Nav navbar className="ml-auto">
            {isloggedIn === false &&
            <NavItem>
              <NavLink href="/login">
                Login
              </NavLink>
            </NavItem>
            }
            {isloggedIn !== false &&
            <NavItem>
              <NavLink href="/login" onClick={() => {localStorage.removeItem('authToken')}}>
                Logout
              </NavLink>
            </NavItem>
            }
            {isloggedIn === false &&
            <NavItem>
              <NavLink href="/signup">
                Sign Up
              </NavLink>
            </NavItem>
            }
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}
