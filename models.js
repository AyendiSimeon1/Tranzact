const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

userSchema.virtual('wallets', {
    ref: 'Wallet',
    localField: '_id',
    foreignField: 'ownerId'
});

const walletTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    minimumBalance: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    monthlyInterestRate: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
});

const walletSchema = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    typeId: {
        type: Schema.Types.ObjectId,
        ref: 'WalletType',
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

const transactionSchema = new Schema({
    fromWalletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    toWalletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
const WalletType = mongoose.model('WalletType', walletTypeSchema);
const Wallet = mongoose.model('Wallet', walletSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {
    User,
    WalletType,
    Wallet,
    Transaction
};



