const plaidClient = require('../plaidClient');
const BankAccount = require('../models/bankAccount');
const User = require('../models/user')
const moment = require('moment');

exports.fetchMonthlyTransactionData = async (req, res) => {
    const userId = req.user.userId;

    const bankAccount = await BankAccount.findOne({ userId });
    if (!bankAccount) {
        return res.status(404).json({ error: 'Bank account not found' });
    }

    const { accessToken } = bankAccount;
    const startDate = moment().startOf('month').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');

    try {
        const response = await plaidClient.transactionsGet({
            access_token: accessToken,
            start_date: startDate,
            end_date: endDate,
        });

        const formattedTransactions = response.data.transactions.map(t => ({
            date: t.date,
            name: t.name,
            amount: t.amount,
            category: t.category.join(", "), // Assumes category is an array
        })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date in descending order

        res.json({ transactions: formattedTransactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions. Please try again.' });
    }
};

exports.fetchYearlyTransactionData = async (req, res) => {
    const userId = req.user.userId;

    const bankAccount = await BankAccount.findOne({ userId });
    if (!bankAccount) {
        return res.status(404).json({ error: 'Bank account not found' });
    }

    const { accessToken } = bankAccount;
    const startDate = moment().startOf('year').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');

    try {
        const response = await plaidClient.transactionsGet({
            access_token: accessToken,
            start_date: startDate,
            end_date: endDate,
        });

        const formattedTransactions = response.data.transactions.map(t => ({
            date: t.date,
            name: t.name,
            amount: t.amount,
            category: t.category.join(", "), // Assumes category is an array
        })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date in descending order

        res.json({ transactions: formattedTransactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions. Please try again.' });
    }
};
