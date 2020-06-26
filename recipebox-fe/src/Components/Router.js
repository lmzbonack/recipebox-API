import React from "react"
import { Router } from "@reach/router"

import CreatedRecipes from '../pages/CreatedRecipes'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import Reset from '../pages/Reset'
import NewPassword from '../pages/NewPassword'
import Recipes from '../pages/Recipes'
import ScrapingManifests from '../pages/ScrapingManifests'
import Search from '../pages/Search'
import StarredRecipes from '../pages/StarredRecipes'
import ShoppingListEdit from '../pages/ShoppingListEdit'
import ShoppingListDisplay from '../pages/ShoppingListDisplay'
import ShoppingListView from '../pages/ShoppingListView'


function ExportRouter(props){
  return (
    <Router>
      <Recipes path="/"/>
      <Recipes path="/recipes"/>
      <Search path="/search"/>
      <CreatedRecipes path="/created-recipes"/>
      <StarredRecipes path="/starred-recipes"/>
      <ShoppingListEdit path="/shopping-list"/>
      <ShoppingListDisplay path="/shopping-list-display"/>
      <ShoppingListView path="/shopping-list/:shoppingListId"/>
      <ScrapingManifests path="created-manifests"/>
      <Login path="/login"/>
      <SignUp path="/signup"/>
      <Reset path="/reset"/>
      <NewPassword path='/reset/:token'/>
    </Router>
  )
}

export default ExportRouter
