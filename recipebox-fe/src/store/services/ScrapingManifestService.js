/**
 * Service for CRUD operations around scraping manifests
 * And for Scraping
 */
import axios from 'axios'
import { navigate } from "@reach/router"

import utils from './utils'

export default {
  /**
   * Creates a single Scraping Manifest
   * @param {Object} payload an object containing values for the smanifest to create
  */
  async create(payload) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.post(`${process.env.REACT_APP_API_URL}/scraping-manifest`, payload, config)
    } else {
      navigate('/login')
      return 'No token'
    }
  },
  /**
   * Retrieves a single smanifest
   * @param {string} id the id of the smanifest
   */
  async fetchOne(id) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.get(`${process.env.REACT_APP_API_URL}/scraping-manifest/${id}`, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Retrieves all smanifest
   */
  async fetchAll() {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.get(`${process.env.REACT_APP_API_URL}/scraping-manifest`, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Updates a single smanifest
   * @param {string} id the id of the smanifest
   * @param {Object} payload an object containing values for the smanifest to update
   */
  async update(id, payload) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.put(`${process.env.REACT_APP_API_URL}/scraping-manifest/${id}`, payload, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Deletes a single smanifest
   * @param {string} id the id of the smanifest to be deleted
   */
  async delete(id) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.delete(`${process.env.REACT_APP_API_URL}/scraping-manifest/${id}`, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Retrieves data for a defined smanifest
   * @param {string} url the url to scrape
   */
  async scrape(payload) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.post(`${process.env.REACT_APP_API_URL}/scrape`, payload, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },


}
