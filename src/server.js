const {REST_PORT} = require("./config");

const apiai = require('apiai');
const express = require('express');
const bodyParser = require('body-parser');

const verificationController = require('./controllers/verification');
const messageWebhookController = require('./controllers/messageWebhook');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*app.get("/webhook/", (req, res) => {
    return res.status(200).json({
        status: {
            code: 200,
            text: "Hello World Webhook"
        }
    });
});

app.post('/webhook/', (req, res) => {
    try {
        var speech = 'empty speech';
        var message = {};
        var recipientId = "";

        if (req.body) {
            var requestBody = JSON.parse(req.body);

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                }

                if (requestBody.originalRequest && requestBody.originalRequest.data && requestBody.originalRequest.sender) {
                  recipientId = requestBody.originalRequest.data.sender.id;
                }

                message = {
                  attachment: {
                    type: "template",
                    payload: {
                      template_type: "list",
                      elements: [{
                        title: "Test Job",
                        subtitle: "Test job subtitle",
                        buttons: [{
                          title: "Apply",
                          url: "http://google.com"
                        }],
                      }],
                    },
                  },
                };
            }
        }

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample',
            data: {
              facebook: message
            },
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }

});*/

app.listen(REST_PORT, () => {
    console.log('Rest service ready on port ' + REST_PORT);
});

app.get('/', verificationController);
app.post('/', messageWebhookController);