import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { InputPlaceOrderFacadeDto, OutputPlaceOrderFacadeDto } from "./checkout.facade.dto";
import CheckoutFacadeInterface from "./checkout.facade.interface";

export default class CheckoutFacade implements CheckoutFacadeInterface {
    private _placeOrderUseCase: UseCaseInterface<InputPlaceOrderFacadeDto, OutputPlaceOrderFacadeDto>;

    constructor(placeOrderUseCase: UseCaseInterface<InputPlaceOrderFacadeDto, OutputPlaceOrderFacadeDto>) {
        this._placeOrderUseCase = placeOrderUseCase;
    }

    async placeOrder(input: InputPlaceOrderFacadeDto): Promise<OutputPlaceOrderFacadeDto> {
        return await this._placeOrderUseCase.execute(input);
    }
}