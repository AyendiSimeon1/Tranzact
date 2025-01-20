const { Wallet,  WalletType, Transaction, User } = require('./models');

class WalletService {
    async getAllUsers() {
        return User.find().populate({
            path: 'wallets',
            populate: { path: 'typeId' }
        });
    };
    async createWalletType(name, minimumBalance, monthlyInterestRate) {
        try {
            const walletType = new WalletType({
                name,
                minimumBalance,
                monthlyInterestRate
            });
    
            await walletType.save();
            return walletType;
        } catch (error) {
            throw new Error('Error creating wallet type', error);
        }
    }

    async getAllWalletTypes() {
        return WalletType.find();
    }

    async getWalletTypeById(walletTypeId) {
        const walletType = await WalletType.findById(walletTypeId);

        if (!walletType) {
            throw new Error('Wallet type not found');
        }
        return walletType;
    }

    async updateWalletType(walletTypeId, updates) {
        const walletType = await WalletType.findByIdAndUpdate(walletTypeId, updates, { new: true });

        if (!walletType) {
            throw new Error('Wallet type not found');
        }
        return walletType;
    }

    async deleteWalletType(walletTypeId) {
        const walletType = await WalletType.findByIdAndDelete(walletTypeId);

        if (!walletType) {
            throw new Error('Wallet type not found');
        }
        return walletType;
    }

    async createWallet(userId, typeId, initialBalance) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const wallet = new Wallet({
            ownerId: userId,
            typeId,
            balance: initialBalance
        });

        await wallet.save();
        return wallet;
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