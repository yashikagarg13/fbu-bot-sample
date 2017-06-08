const request = require('request');

module.exports = (category) => {
  request({
    uri: apiUrl,
    method: 'GET',
  }, (err, response, body) => {
    return res.json({
        speech: "Here are jobs under " + category + " category",
        displayText: "Here are jobs under " + category + " category",
        source: 'webhook'
    });
  })
}