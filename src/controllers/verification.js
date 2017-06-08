const {FB_VERIFY_TOKEN} = require("../config");

module.exports = (req, res) => {
  console.log('Verification');
  const hubChallenge = req.query['hub.challenge'];

  const hubMode = req.query['hub.mode'];
  const verifyTokenMatches = (req.query['hub.verify_token'] === FB_VERIFY_TOKEN);

  if (hubMode && verifyTokenMatches) {
      res.status(200).send(hubChallenge);
  } else {
      res.status(403).end();
  }
};
