export default {
  retrieveAuthToken() {
    const itemStr = localStorage.getItem('authToken')
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem('authToken')
      return null
    }
    return item.token
  }
}
