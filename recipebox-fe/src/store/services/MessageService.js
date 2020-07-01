/**
 * Service for Sending messages. Right now just emails
 */

import axios from 'axios'

export default {
  /**
   * Sends a reset request to email specified in payload
   * @param {Object} payload an object containing email to send reset request to
   */
  async forgot(payload) {
    return axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot`, payload)
  },
  /**
   * Resets a password for a specified user. Denoted by a token
   * @param {Object} payload an object containing the new password and reset_token
   */
  async reset(payload) {
    return axios.post(`${process.env.REACT_APP_API_URL}/auth/reset`, payload)
  }
}
