const axios = require('axios');

const get = function(url) {
  return axios.get(url)
}

const post = function(url, data) {
  return axios.post(url, data)
}

module.exports = {
  get,
  post
}