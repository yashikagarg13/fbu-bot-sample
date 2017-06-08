const {APIAI_ACCESS_TOKEN, FB_PAGE_ACCESS_TOKEN} = require("../config");
const CAT_IMAGE_URL = "https://botcube.co/public/blog/apiai-tutorial-bot/hosico_cat.jpg";

const apiAiClient = require('apiai')(APIAI_ACCESS_TOKEN);
const request = require('request');

const sendCardMessage = (senderId, text) => {
  console.log('sendCardMessage', senderId);
  request({
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
  }, function(err, httpResponse) {
    console.log('err', err);
    // console.log('httpResponse', httpResponse);
  });
};

const sendTextMessage = (senderId, text) => {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
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
        const intent = response.result.metadata.intentName;

       console.log('result, intent', result, intent);
        if (intent === "search-job") {
          sendCardMessage(senderId);
        } else {
          sendTextMessage(senderId, result);
        }
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};