/**
 * Service for user retrieval, signing up and signing in
 */
import axios from 'axios'
import { navigate } from "@reach/router"

import utils from './utils'

export default {
  /**
   * Signs up a user
   * @param {Object} payload the sign up payload with an email and username
   */
  signUp(payload) {
    return axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, payload)
  },
  /**
   * Logs in a user
   * @param {Object} payload the login payload with an email and username
   */
  login(payload) {
    return axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, payload)
  },
  /**
   * Retrieves User Overview
   */
  async fetchUserOverview() {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      return axios.get(`${process.env.REACT_APP_API_URL}/user`, config)
    } else {
      navigate('/login')
      return 'No Token'
    }
  },
  /**
   * Retrieves specific piece of user data for a logged in user
   * @param {string} dataPiece the route name for the piece of data
   * being retrieved EG. 'shopping-list' 'starred-recipes'
   */
  async fetchUserData(dataPiece, page) {
    let token = await utils.retrieveAuthToken()
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      // if pass in page call it with page
      if (page) {
        return axios.get(`${process.env.REACT_APP_API_URL}/user/${dataPiece}?page=${page}`, config)
      } else {
        return axios.get(`${process.env.REACT_APP_API_URL}/user/${dataPiece}`, config)
      }
    } else {
      navigate('/login')
      return 'No Token'
    }
  }


}
