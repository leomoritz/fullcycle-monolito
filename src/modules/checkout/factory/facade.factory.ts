import CheckoutFacade from "../facade/checkout.facade";
import CheckoutFacadeInterface from "../facade/checkout.facade.interface";
import PlaceOrderUseCaseFactory from "./place-order.usecase.factory";

export default class CheckoutFacadeFactory {
    static create(): CheckoutFacadeInterface {
        const useCase = PlaceOrderUseCaseFactory.create();
        return new CheckoutFacade(useCase);
    }
}