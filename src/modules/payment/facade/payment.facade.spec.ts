import { Sequelize } from "sequelize-typescript"
import TransactionModel from "../repository/transaction.model";
import PaymentFacadeFactory from "./payment.facade.factory";

describe("PaymentFacade test", () => {
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

    it("should save a approved transaction", async () => {
        // Arrange
        const facade = PaymentFacadeFactory.create();

        const input = {
            orderId: "4c01dfa7-6073-4ce2-a3ae-9341a4b540d4",
            amount: 100
        };

        const output = await facade.process(input);

        expect(output).toBeDefined();
        expect(output.transactionId).toBeDefined();
        expect(output.orderId).toBe(input.orderId);
        expect(output.amount).toBe(input.amount);
        expect(output.status).toBe("approved");
        expect(output.createdAt).toBeInstanceOf(Date);
        expect(output.updatedAt).toBeInstanceOf(Date);
    });

    it("should save a declined transaction", async () => {
        // Arrange
        const facade = PaymentFacadeFactory.create();

        const input = {
            orderId: "b5da2d2f-a36b-4d00-b9af-9907d75dd960",
            amount: 50
        };

        const output = await facade.process(input);

        expect(output).toBeDefined();
        expect(output.transactionId).toBeDefined();
        expect(output.orderId).toBe(input.orderId);
        expect(output.amount).toBe(input.amount);
        expect(output.status).toBe("declined");
        expect(output.createdAt).toBeInstanceOf(Date);
        expect(output.updatedAt).toBeInstanceOf(Date);
    });

});