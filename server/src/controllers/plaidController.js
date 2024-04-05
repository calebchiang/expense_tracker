const plaidClient = require('../plaidClient');
const BankAccount = require('../models/bankAccount');
const User = require('../models/user')

exports.createLinkToken = async (req, res) => {
    try {
        const response = await plaidClient.linkTokenCreate({
            user: {
                client_user_id: req.user.userId,
            },
            client_name: 'Expense Tracker',
            language: 'en',
            country_codes: ['CA'],
            products: ['transactions', 'auth'],
        });
        res.json({ link_token: response.data.link_token });
    } catch (error) {
        console.error('Error creating link token:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.exchangePublicToken = async (req, res) => {
    const { publicToken } = req.body;
    if (!publicToken) {
        return res.status(400).json({ error: 'Public token is required.' });
    }

    // Check if user exists
    const userExists = await User.findById(req.user.userId);
    if (!userExists) {
        return res.status(404).json({ error: 'User not found.' });
    }

    try {
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
        const accessToken = exchangeResponse.data.access_token;
        const itemId = exchangeResponse.data.item_id;

        await BankAccount.create({
            userId: req.user.userId,
            accessToken: accessToken,
            itemId: itemId,
        });

        await User.findByIdAndUpdate(req.user.userId, { isBankConnected: true });

        res.status(200).json({ message: 'Bank account linked successfully.' });
    } catch (error) {
        console.error('Error exchanging public token:', error.message);
        res.status(500).json({ error: 'Failed to exchange public token. Please try again.' });
    }
};
