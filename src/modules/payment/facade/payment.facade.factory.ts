import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";
import PaymentFacade from "./payment.facade";
import PaymentFacadeInterface from "./payment.facade.interface";

export default class PaymentFacadeFactory {
    static create(): PaymentFacadeInterface {
        const transactionRepository = new TransactionRepository();
        const processPaymentUseCase = new ProcessPaymentUseCase(transactionRepository);
        const paymentFacade = new PaymentFacade(processPaymentUseCase);

        return paymentFacade;
    }
}