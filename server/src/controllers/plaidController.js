const plaidClient = require('../plaidClient');

exports.createLinkToken = async (req, res) => {
    try {
        const response = await plaidClient.linkTokenCreate({
            user: {
                client_user_id: req.user.userId,
            },
            client_name: 'Expense Tracker',
            language: 'en',
            country_codes: ['US'],
            products: ['transactions', 'auth'],
        });
        res.json({ link_token: response.data.link_token });
    } catch (error) {
        console.error('Error creating link token:', error);
        res.status(500).json({ error: error.message });
    }
};
