const plaidClient = require('../plaidClient');
const BankAccount = require('../models/bankAccount');
const User = require('../models/user')
const moment = require('moment');

exports.fetchRawTransactionData = async (req, res) => {
    const userId = req.user.userId;

    const bankAccount = await BankAccount.findOne({ userId });
    if (!bankAccount) {
        return res.status(404).json({ error: 'Bank account not found' });
    }

    const { accessToken } = bankAccount;
    // Use the first day of the current year as the start date
    const startDate = moment().startOf('year').format('YYYY-MM-DD');
    // Use today's date as the end date
    const endDate = moment().format('YYYY-MM-DD');

    try {
        const response = await plaidClient.transactionsGet({
            access_token: accessToken,
            start_date: startDate,
            end_date: endDate,
        });

        const rawTransactions = response.data.transactions.map(t => ({
            date: t.date,
            name: t.name,
            amount: t.amount,
            category: t.category.join(", "),
        })).sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({ transactions: rawTransactions });
        console.log({ transactions: rawTransactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions. Please try again.' });
    }
};

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

        // Filter out positive transactions to focus on spendings
        const spendingTransactions = response.data.transactions.filter(t => t.amount > 0);

        const formattedTransactions = spendingTransactions.map(t => ({
            date: t.date,
            name: t.name,
            amount: Math.abs(t.amount), // Convert amount to positive value for readability
            category: t.category.join(", "),
        })).sort((a, b) => new Date(b.date) - new Date(a.date));

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
    const startDate = moment().startOf('year').format('YYYY-MM-DD'); // First day of the current year
    const endDate = moment().format('YYYY-MM-DD');

    try {
        const response = await plaidClient.transactionsGet({
            access_token: accessToken,
            start_date: startDate,
            end_date: endDate,
        });

        // Filter for transactions with negative amounts and format the transactions
        const spendingTransactions = response.data.transactions.filter(t => t.amount > 0);
        const formattedTransactions = spendingTransactions.map(t => ({
            date: t.date,
            name: t.name,
            amount: Math.abs(t.amount),
            category: t.category.join(", "),
        })).sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({ transactions: formattedTransactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions. Please try again.' });
    }
};
