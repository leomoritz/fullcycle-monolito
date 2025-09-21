import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

const transaction = new Transaction({
    amount: 150,
    orderId: "4d4695da-86c1-422c-ba81-d816124fe1a0",
    status: "approved",
});

const MockRepository = () => {
    return {
        save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
    }
}

const transactionDeclined = new Transaction({
    amount: 50,
    orderId: "7ceef061-d51f-4a66-b270-232892627b7b",
    status: "declined",
});

const MockRepositoryDeclined = () => {
    return {
        save: jest.fn().mockReturnValue(Promise.resolve(transactionDeclined)),
    }
}

describe("Process payment usecase unit test", () => {
    it("should process a payment like approved", async () => {
        // Arrange
        const paymentRepository = MockRepository();
        const usecase = new ProcessPaymentUseCase(paymentRepository);
        const input = {
            orderId: "4d4695da-86c1-422c-ba81-d816124fe1a0",
            amount: 150,
        };

        // Act
        const output = await usecase.execute(input);

        // Assert
        expect(paymentRepository.save).toHaveBeenCalled();
        expect(output.status).toBe("approved");
        expect(output.transactionId).toBe(transaction.id.id);
        expect(output.orderId).toBe(transaction.orderId);
        expect(output.amount).toBe(transaction.amount);
        expect(output.createdAt).toEqual(transaction.createdAt);
        expect(output.updatedAt).toEqual(transaction.updatedAt);
    });

    it("should decline a transaction", async () => {
        // Arrange
        const paymentRepository = MockRepositoryDeclined();
        const usecase = new ProcessPaymentUseCase(paymentRepository);
        const input = {
            orderId: "4d4695da-86c1-422c-ba81-d816124fe1a0",
            amount: 50,
        };

        // Act
        const output = await usecase.execute(input);

        // Assert
        expect(paymentRepository.save).toHaveBeenCalled();
        expect(output.status).toBe("declined");
        expect(output.transactionId).toBe(transactionDeclined.id.id);
        expect(output.orderId).toBe(transactionDeclined.orderId);
        expect(output.amount).toBe(transactionDeclined.amount);
        expect(output.createdAt).toEqual(transactionDeclined.createdAt);
        expect(output.updatedAt).toEqual(transactionDeclined.updatedAt);
    });
});