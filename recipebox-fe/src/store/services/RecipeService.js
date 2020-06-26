/**
 * Service for Interacting with Recipes endpoint
 */
import axios from 'axios'
import { navigate } from "@reach/router"

import utils from './utils'

export default {
  /**
   * Creates a single recipe
   * @param {Object} payload an object containing values for the recipe to create
   */
  async create(payload) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.post(`${process.env.REACT_APP_API_URL}/recipes`, payload, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Retrieves a single recipe
   * @param {string} id the id of the recipe
   */
  async fetchOne(id) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.get(`${process.env.REACT_APP_API_URL}/recipes/${id}`, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Retrieves all recipes no auth token needed
   */
  async fetchAll(page) {
      return axios.get(`${process.env.REACT_APP_API_URL}/recipes?page=${page}`)
  },
  /**
   * Updates a single recipe
   * @param {string} id the id of the recipe
   * @param {Object} payload an object containing values for the recipe to update
   */
  async update(id, payload) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.put(`${process.env.REACT_APP_API_URL}/recipes/${id}`, payload, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Deletes a single recipe
   * @param {string} id the id of the recipe to be deleted
   */
  async delete(id) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.delete(`${process.env.REACT_APP_API_URL}/recipes/${id}`, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Stars a single recipe
   * @param {string} id the id of the recipe to be starred
   */
  async star(id) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.put(`${process.env.REACT_APP_API_URL}/star/${id}`, {}, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * UnStars a single recipe
   * @param {string} id the id of the recipe to be unstarred
   */
  async unStar(id) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.delete(`${process.env.REACT_APP_API_URL}/star/${id}`, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Searchs for input that a user provides
   * @param {string} query the thing to be searched
   */
  async search(query) {
    return axios.get(`${process.env.REACT_APP_API_URL}/recipes/search?query=${query}`)
  }
}
