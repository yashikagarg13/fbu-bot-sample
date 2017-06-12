const {APIAI_ACCESS_TOKEN, FB_PAGE_ACCESS_TOKEN} = require("../config");
const CAT_IMAGE_URL = "https://botcube.co/public/blog/apiai-tutorial-bot/hosico_cat.jpg";

const apiAiClient = require('apiai')(APIAI_ACCESS_TOKEN);
const request = require("request");
const rp = require('request-promise-native');

let categories = [];
const getJobs = (senderId, category) => {
  return rp({
    uri: "https://powertofly.com/api/v1/categories/",
    json: true,
    method: "GET",
    headers: {
      "Authorization": "Bearer 10rJS0M6ZHJ9vCPlRVWYHAdlioDfSC"
    },
  }).then(function (response) {
    let categoryId = response.data.filter(c => c.title === category)[0].id;
    return rp({
      uri: "https://powertofly.com/api/v1/jobs/?status=Active&per_page=3&page=0&filter=category_id==" +
        categoryId + "&fields=id,title,header_image_name",
      json: true,
      method: "GET",
      headers: {
        "Authorization": "Bearer 10rJS0M6ZHJ9vCPlRVWYHAdlioDfSC"
      },
    })
  }).then(function (response) { console.log('response', response);
    let jobs = response.data;
    let total = response.meta.total;

    if (total == 0) {
      return sendTextMessage(senderId, "No jobs found under " + category + " category");
    } else {
      let elements = jobs.map(job => ({
        title: job.title,
        image_url: "https://dev-assets.powertofly.com/job-headers/common/small/" + job.header_image_name,
        buttons: [{
          type: "web_url",
          title: "Apply",
          url: "https://powertofly.com/jobs/detail/" + job.id,
        }],
      }));
      return sendCardMessage(senderId, elements);
    }
  }).then(function (response) {
    console.log('response', response);
  }).catch(function (error) {
    console.log('error', error);
  });
};

const sendCardMessage = (senderId, elements) => {
  return rp({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FB_PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
     recipient: { id: senderId },
     message: {
       attachment: {
         type: "template",
         payload: {
           template_type: "generic",
           elements,
         }
       }
     }
    }
  })
}

const sendTextMessage = (senderId, text) => {
  return request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FB_PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: senderId },
      message: { text },
    }
  });
};

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;

    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'ptf_job_search'});

    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;
        const category = response.result.parameters.category;

       console.log('result, category', result, category);
        if (category) {
          getJobs(senderId, category);
        } else {
          sendTextMessage(senderId, result);
        }
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};