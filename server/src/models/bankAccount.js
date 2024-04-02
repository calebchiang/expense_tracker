const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    accessToken: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
        unique: true
    },
    bankName: {
        type: String,
        required: false
    },
    accountType: {
        type: String,
        required: false
    },
    isConnected: {
        type: Boolean,
        required: true,
        default: true
    }
})

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);
module.exports = BankAccount;