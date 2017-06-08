const {APIAI_ACCESS_TOKEN, FB_PAGE_ACCESS_TOKEN} = require("../config");
const CAT_IMAGE_URL = "https://botcube.co/public/blog/apiai-tutorial-bot/hosico_cat.jpg";

const apiAiClient = require('apiai')(APIAI_ACCESS_TOKEN);
const request = require("request");
const rp = require('request-promise');

const sendCardMessage = (senderId, category) => {
  let response = {};
  return rp("https://qa.powertofly.com/api/v1/jobs?per_page=3&filter=category_title=="+category).
    .then((response) =>  
      response = res;
      console.log('response', response);
      request.post({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FB_PAGE_ACCESS_TOKEN },
        json: {
          recipient: { id: senderId },
          message: {
            attachment: {
              type: "template",
              payload: {
                template_type: "generic",
                elements: [{
                  title: "Test Job",
                  subtitle: "Test job subtitle",
                  image_url: CAT_IMAGE_URL,
                  buttons: [{
                    type: "web_url",
                    title: "Apply",
                    url: "www.google.com"
                  }],
                }],
              },
            },
          },
        }
      });
    })
    .catch((error) => {
    
    })
};

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
          sendCardMessage(senderId, category);
        } else {
          sendTextMessage(senderId, result);
        }
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};