const {APIAI_ACCESS_TOKEN, FB_PAGE_ACCESS_TOKEN} = require("../config");

const rp = require('request-promise-native');

module.exports = (req, res) => {
  const action = req.body.result.action;
  const category = req.body.result.parameters["category"];
  console.log('action', action);
  console.log('category', category);
  if (action == "search-job" && category) {
    return rp({
      uri: "https://powertofly.com/api/v1/categories/",
      json: true,
      method: "GET",
      headers: {
        "Authorization": "Bearer 10rJS0M6ZHJ9vCPlRVWYHAdlioDfSC"
      },
    }).then(function (response) {
      let categoryId = response.data.filter(c => c.title === category)[0].id;
      if (categoryId) {
        return rp({
          uri: "https://powertofly.com/api/v1/jobs/?status=Active&per_page=3&page=0&filter=category_id==" +
            categoryId + "&fields=id,title,header_image_name",
          json: true,
          method: "GET",
          headers: {
            "Authorization": "Bearer 10rJS0M6ZHJ9vCPlRVWYHAdlioDfSC"
          },
        });
      } else {
        return res.json({
          speech: "No jobs found under " + category + " category",
          displayText: "No jobs found under " + category + " category",
          source: 'search-job'
        });
      }
    }).then(function (response) {
      let jobs = response.data;
      let total = response.meta.total;

      if (total == 0) {
        return res.json({
          speech: "No jobs found under " + category + " category",
          displayText: "No jobs found under " + category + " category",
          source: 'search-job'
        });
      } else {
        return res.json({
          speech: "Here are top 3 jobs under " + category + " category",
          displayText: "Here are top 3 jobs under " + category + " category",
          source: 'search-job'
        });
      }
    }).then(function (response) {
      console.log('response', response);
    }).catch(function (error) {
      console.log('error', error);
    });
  }
};