import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { InputProcessPaymentDto, OutputProcessPaymentDto } from "../usecase/process-payment/process-payment.dto";
import { InputPaymentFacadeDto, OutputPaymentFacadeDto } from "./payment.facade.dto";
import PaymentFacadeInterface from "./payment.facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {
    constructor(private _processPaymentUseCase: UseCaseInterface<InputProcessPaymentDto, OutputProcessPaymentDto>) { }

    async process(input: InputPaymentFacadeDto): Promise<OutputPaymentFacadeDto> {
        return await this._processPaymentUseCase.execute(input);
    }
}