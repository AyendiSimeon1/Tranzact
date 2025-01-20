const express = require('express');
const WalletService = require('./walletService');
const router = express.Router();
const walletService = new WalletService();

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Users route
router.get('/users', asyncHandler(async (req, res) => {
    const users = await walletService.getAllUsers();
    res.json(users);
}));

// WalletTypes routes - moved outside of /users route
router.get('/walletTypes', asyncHandler(async (req, res) => {
    const walletTypes = await walletService.getAllWalletTypes();
    res.json(walletTypes);
}));

router.post('/walletTypes', asyncHandler(async (req, res) => {
    const { name, minimumBalance, monthlyInterestRate } = req.body;
    const walletType = await walletService.createWalletType(name, minimumBalance, monthlyInterestRate);
    res.json(walletType);
}));

router.get('/walletTypes/:id', asyncHandler(async (req, res) => {
    const walletType = await walletService.getWalletTypeById(req.params.id);
    res.json(walletType);
}));

router.put('/walletTypes/:id', asyncHandler(async (req, res) => {
    const updates = req.body;
    const walletType = await walletService.updateWalletType(req.params.id, updates);
    res.json(walletType);
}));

router.delete('/walletTypes/:id', asyncHandler(async (req, res) => {
    await walletService.deleteWalletType(req.params.id);
    res.status(204).send();
}));

router.post('/wallets', asyncHandler(async (req, res) => {
    const { userId, typeId, initialBalance } = req.body;
    const wallet = await walletService.createWallet(userId, typeId, initialBalance);
    res.json(wallet);
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