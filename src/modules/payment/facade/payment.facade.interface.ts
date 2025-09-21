import { InputPaymentFacadeDto, OutputPaymentFacadeDto } from "./payment.facade.dto";

export default interface PaymentFacadeInterface {
    process(input: InputPaymentFacadeDto): Promise<OutputPaymentFacadeDto>;
}