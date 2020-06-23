/**
 * Service for Shopping List Retrieval
 */
import axios from 'axios'
import { navigate } from "@reach/router"

import utils from './utils'

export default {
  /**
   * Creates a single shopping list
   * @param {Object} payload an object containing values for the shopping list to create
   */
  async create(payload) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.post(`${process.env.REACT_APP_API_URL}/shopping-list`, payload, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Retrieves a single shopping list
   * @param {string} id the id of the shopping list
   */
  fetchOne(id) {
    return axios.get(`${process.env.REACT_APP_API_URL}/shopping-list/${id}`)
  },
  /**
   * Updates a single shopping list
   * @param {string} id the id of the shopping list
   * @param {Object} payload an object containing values for the shopping list to update
   */
  async update(id, payload) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.put(`${process.env.REACT_APP_API_URL}/shopping-list/${id}`, payload, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Deletes a single shopping list
   * @param {string} id the id of the shopping list
   */
  async delete(id) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.delete(`${process.env.REACT_APP_API_URL}/shopping-list/${id}`, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Creates a single shopping list and adds a recipe to it
   * @param {Object} payload an object containing values for the shopping list to create
   */
  async createWithRecipe(payload) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.post(`${process.env.REACT_APP_API_URL}/recipe-adder`, payload, config)
    }else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Adds a single recipe to an existing shopping list
   * @param {string} id the id of the shopping list
   * @param {Object} payload an object containing values for the recipe to add
   */
  async updateWithRecipe(id, payload) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.put(`${process.env.REACT_APP_API_URL}/recipe-adder/${id}`, payload, config)
    }else {
      navigate('/login')
      return 'No Token'
    }
  },
    /**
   * Removes a single recipe from an existing shopping list
   * @param {string} id the id of the shopping list
   * @param {Object} payload an object containing values for the recipe to remove
   */
  async deleteSingleRecipe(id, payload) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      // Axios will not let you send in data unless you do it this way
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        data: payload
      }
      return axios.delete(`${process.env.REACT_APP_API_URL}/recipe-adder/${id}`, config)
    }else {
      navigate('/login')
      return 'No Token'
    }
  }
}
