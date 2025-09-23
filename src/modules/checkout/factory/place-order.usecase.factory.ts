import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeFactory from "../../client-adm/facade/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/facade/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/facade/product-adm.facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/facade/facade.factory";
import { OrderRepository } from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class PlaceOrderUseCaseFactory {
    static create(): UseCaseInterface<any, any> {
        const useCase = new PlaceOrderUseCase(
            ClientAdmFacadeFactory.create(),
            ProductAdmFacadeFactory.create(),
            StoreCatalogFacadeFactory.create(),
            new OrderRepository(),
            InvoiceFacadeFactory.create(),
            PaymentFacadeFactory.create()
        );

        return useCase;
    }
}