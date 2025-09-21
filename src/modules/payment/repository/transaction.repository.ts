import Transaction, { TransactionId } from "../domain/transaction";
import PaymentGateway from "../gateway/payment-gateway";
import TransactionModel from "./transaction.model";

export default class TransactionRepository implements PaymentGateway {
    async save(input: Transaction): Promise<Transaction> {
        const transaction = await TransactionModel.create({
            id: input.id.id,
            amount: input.amount,
            orderId: input.orderId,
            status: input.status,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt
        });

        return new Transaction({
            id: new TransactionId(transaction.id),
            amount: transaction.amount,
            orderId: transaction.orderId,
            status: transaction.status,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt
        });
    }
}