import { InputPlaceOrderFacadeDto, OutputPlaceOrderFacadeDto } from "./checkout.facade.dto";

export default interface CheckoutFacadeInterface {
    placeOrder(input: InputPlaceOrderFacadeDto): Promise<OutputPlaceOrderFacadeDto>;
}