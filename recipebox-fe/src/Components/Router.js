import React from "react"
import { Router } from "@reach/router"

import CreatedRecipes from '../pages/CreatedRecipes'
import Login from '../pages/Login'
import Recipes from '../pages/Recipes'
import ScrapingManifests from '../pages/ScrapingManifests'
import Search from '../pages/Search'
import StarredRecipes from '../pages/StarredRecipes'
import ShoppingListEdit from '../pages/ShoppingListEdit'
import ShoppingListDisplay from '../pages/ShoppingListDisplay'
import ShoppingListView from '../pages/ShoppingListView'
import SignUp from '../pages/SignUp'


function ExportRouter(props){
  return (
    <Router>
      {/* Maybe set this up to Redirect instead */}
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
    </Router>
  )
}

export default ExportRouter
