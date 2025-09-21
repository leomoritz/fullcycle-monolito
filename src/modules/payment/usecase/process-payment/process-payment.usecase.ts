import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Transaction from "../../domain/transaction";
import PaymentGateway from "../../gateway/payment-gateway";
import { InputProcessPaymentDto, OutputProcessPaymentDto } from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface<InputProcessPaymentDto, OutputProcessPaymentDto> {
    constructor(private transactionRepository: PaymentGateway) { }

    async execute(input: InputProcessPaymentDto): Promise<OutputProcessPaymentDto> {
        const transaction = new Transaction({
            amount: input.amount,
            orderId: input.orderId,
        });

        transaction.process(); // Se estivéssemos trabalhando com um sistema real, aqui chamaríamos um serviço de pagamento externo 
        // para processar a transação e retornar o status real da transação para persistirmos no banco de dados.

        const persistTransaction = await this.transactionRepository.save(transaction);

        return {
            transactionId: persistTransaction.id.id,
            orderId: persistTransaction.orderId,
            amount: persistTransaction.amount,
            status: persistTransaction.status,
            createdAt: persistTransaction.createdAt,
            updatedAt: persistTransaction.updatedAt,
        };
    }
}