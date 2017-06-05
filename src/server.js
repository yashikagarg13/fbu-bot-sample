const {REST_PORT} = require("./config");

const apiai = require('apiai');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.text({type: 'application/json'}));

app.post('/webhook/', (req, res) => {
    try {
        console.log('req', req);
        console.log('res', res);
        return res.status(200).json({
            status: "ok"
        });
    } catch (err) {
        return res.status(400).json({
            status: "error",
            error: err
        });
    }

});

app.listen(REST_PORT, () => {
    console.log('Rest service ready on port ' + REST_PORT);
});
