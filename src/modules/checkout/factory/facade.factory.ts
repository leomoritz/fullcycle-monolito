import ClientAdmFacadeFactory from "../../client-adm/facade/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/facade/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/facade/product-adm.facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/facade/facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import CheckoutFacadeInterface from "../facade/checkout.facade.interface";
import { OrderRepository } from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacadeFactory {
    static create(): CheckoutFacadeInterface {
        const useCase = new PlaceOrderUseCase(
            ClientAdmFacadeFactory.create(),
            ProductAdmFacadeFactory.create(),
            StoreCatalogFacadeFactory.create(),
            new OrderRepository(),
            InvoiceFacadeFactory.create(),
            PaymentFacadeFactory.create()
        );

        return new CheckoutFacade(useCase);
    }
}