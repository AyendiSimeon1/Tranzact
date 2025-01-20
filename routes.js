import express from 'expres';
import WalletService from './walletService';
const express = require('express');
const router = express.Router();
const walletService = new WalletService();


const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.get('/users', asyncHandler(async (req, res) => {
    const users = await walletService.getAllUsers();
    res.json(users);
}));

router.get('/wallets', asyncHandler(async (req, res) => {
    const wallets = await walletService.getAllWallets();
    res.json(wallets);
}));

router.get('/wallets/:id', asyncHandler(async (req, res) => {
    const wallet = await walletService.getWalletDetails(req.params.id);
    res.json(wallet);
}));

router.post('/transfer', asyncHandler(async (req, res) => {
    const { fromWalletId, toWalletId, amount } = req.body;
    
    if (!fromWalletId || !toWalletId || !amount || amount <= 0) {
        throw new Error('Invalid transfer parameters');
    }

    const transaction = await walletService.transferMoney(fromWalletId, toWalletId, amount);
    res.json(transaction);
}));


router.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({
        error: error.message || 'Internal Server Error'
    });
});

module.exports = router;