const {REST_PORT} = require("./config");

const apiai = require('apiai');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.text({type: 'application/json'}));

app.get("/", (req, res) => {
    return res.status(200).json({
        status: {
            code: 200,
            text: "Hello World"
        }
    });
});

app.get("/webhook/", (req, res) => {
    return res.status(200).json({
        status: {
            code: 200,
            text: "Hello World Webhook"
        }
    });
});

app.post('/webhook/', (req, res) => {
    console.log('hook request');
    try {
        var speech = 'empty speech';

        console.log('type of req.body', type of req.body);
        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
                }
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample'
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

});

app.listen(REST_PORT, () => {
    console.log('Rest service ready on port ' + REST_PORT);
});

// curl 'https://api.api.ai/api/query?v=20150910&query=Hi&lang=en&sessionId=5adc0dba-bcb2-4889-a93e-2c92eaaad3dc&
// timezone=2017-06-05T11:13:13+0530' -H 'Authorization:Bearer 052b4926d06f40d78a0742e3d3d44d05'