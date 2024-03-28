require('dotenv').config();
const plaid = require('plaid')

const client = new plaid.Client({
    clientId: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: plaid.environments[process.env.PLAID_ENV]

});

module.exports = client;