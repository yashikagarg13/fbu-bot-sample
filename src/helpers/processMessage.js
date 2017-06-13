const {APIAI_ACCESS_TOKEN, FB_PAGE_ACCESS_TOKEN} = require("../config");
const CAT_IMAGE_URL = "https://botcube.co/public/blog/apiai-tutorial-bot/hosico_cat.jpg";

const apiAiClient = require('apiai')(APIAI_ACCESS_TOKEN);
const rp = require('request-promise-native');

const sendCardMessage = (senderId, message) => {
  return rp({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FB_PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
     recipient: { id: senderId },
     message
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
       const message = response.result.fulfillment.data;
       
       if (category && message) {
         // sendTextMessage(senderId, result);
         sendCardMessage(senderId, message.facebook);
       } else {
         sendTextMessage(senderId, result);
       }
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};