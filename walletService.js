const { Wallet,  Transaction, User } = require('./models');

class WalletService {
    async getAllUsers() {
        return User.find().populate({
            path: 'wallets',
            populate: { path: 'typeId' }
        });
    }

    async getAllWallets() {
        return Wallet.find()
            .populate('ownerId')
            .populate('typeId');
    }

    async getWalletDetails(walletId) {
        const wallet = await Wallet.findById(walletId)
            .populate('ownerId')
            .populate('typeId');

        if (!wallet) {
            throw new Error('Wallet not found');
        }
        return wallet;
    }

    async transferMoney(fromWalletId, toWalletId, amount) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const [fromWallet, toWallet] = await Promise.all([
                Wallet.findById(fromWalletId).populate('typeId'),
                Wallet.findById(toWalletId)
            ]);

            if (!fromWallet || !toWallet) {
                throw new Error('One or both wallets not found');
            }

            if (fromWallet.balance - amount < fromWallet.typeId.minimumBalance) {
                throw new Error('Insufficient balance or below minimum balance requirement');
            }

            const transaction = new Transaction({
                fromWalletId,
                toWalletId,
                amount,
                status: 'PENDING'
            });

        
            await Promise.all([
                Wallet.findByIdAndUpdate(
                    fromWalletId,
                    { $inc: { balance: -amount } },
                    { session, new: true }
                ),
                Wallet.findByIdAndUpdate(
                    toWalletId,
                    { $inc: { balance: amount } },
                    { session, new: true }
                )
            ]);

            transaction.status = 'COMPLETED';
            await transaction.save({ session });

            await session.commitTransaction();
            return transaction;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

module.exports = WalletService;