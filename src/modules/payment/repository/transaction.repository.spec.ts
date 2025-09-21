import { Sequelize } from "sequelize-typescript"
import TransactionModel from "./transaction.model";
import TransactionRepository from "./transaction.repository";
import Transaction, { TransactionId } from "../domain/transaction";

describe("TransactionRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([TransactionModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should save a transaction", async () => {
        // Arrange
        const transactionProps = {
            id: new TransactionId("a6a63339-f537-4261-8127-984be63f3f4a"),
            orderId: "1",
            amount: 100,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const transactionRepository = new TransactionRepository();
        const transactionToSave = new Transaction(transactionProps);
        transactionToSave.approve();

        // Act
        const transaction = await transactionRepository.save(transactionToSave);

        // Assert
        expect(transaction.id.id).toEqual(transactionProps.id.id);
        expect(transaction.orderId).toEqual(transactionProps.orderId);
        expect(transaction.amount).toEqual(transactionProps.amount);
        expect(transaction.status).toEqual("approved");
        expect(transaction.createdAt).toEqual(expect.any(Date));
        expect(transaction.updatedAt).toEqual(expect.any(Date));
    });
})