import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { OutputFindClientFacadeDto } from "../../../client-adm/facade/client-adm.facade.dto";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import { OutputGenerateInvoiceFacadeDto } from "../../../invoice/facade/invoice.facade.dto";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/payment.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { InputPlaceOrderDto, OutputPlaceOrderDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface<InputPlaceOrderDto, OutputPlaceOrderDto> {
    private _clientFacade: ClientAdmFacadeInterface;
    private _productFacade: ProductAdmFacadeInterface;
    private _catalogFacade: StoreCatalogFacadeInterface;
    private _checkoutRepository: CheckoutGateway;
    private _invoiceFacade: InvoiceFacadeInterface;
    private _paymentFacade: PaymentFacadeInterface;

    constructor(
        clientFacade: ClientAdmFacadeInterface,
        productFacade?: ProductAdmFacadeInterface,
        catalogFacade?: StoreCatalogFacadeInterface,
        checkoutRepository?: CheckoutGateway,
        invoiceFacade?: InvoiceFacadeInterface,
        paymentFacade?: PaymentFacadeInterface
    ) {
        this._clientFacade = clientFacade;
        this._productFacade = productFacade;
        this._catalogFacade = catalogFacade;
        this._checkoutRepository = checkoutRepository;
        this._invoiceFacade = invoiceFacade;
        this._paymentFacade = paymentFacade;
    }

    async execute(input: InputPlaceOrderDto): Promise<OutputPlaceOrderDto> {
        const client = await this._clientFacade.find({ id: input.clientId });

        if (!client) {
            throw new Error("Client not found");
        }

        await this.validateProducts(input);
        const products = await Promise.all(
            input.products.map((product) => this.getProduct(product.productId))
        );

        const orderClient = new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.street,
            complement: client.complement,
            number: client.number,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
        });

        const order = new Order({
            client: orderClient,
            products
        });

        const payment = await this._paymentFacade.process({
            orderId: order.id.id,
            amount: order.total,
        });

        let invoice = null;

        if (payment.status === "approved") {
            order.approved();
            invoice = await this.generateInvoice(orderClient, products);
        }

        this._checkoutRepository.addOrder(order);

        return {
            id: order.id.id,
            invoiceId: invoice ? invoice.id : null,
            status: order.status,
            total: order.total,
            products: order.products.map((p) => {
                return {
                    productId: p.id.id
                }
            }),
        }
    }

    private async validateProducts(input: InputPlaceOrderDto): Promise<void> {
        if (input.products.length === 0) {
            throw new Error("No products selected");
        }

        for (const p of input.products) {
            const product = await this._productFacade.checkStock({ productId: p.productId });
            if (product.stock <= 0) {
                throw new Error(`Product ${product.productId} is out of stock`);
            }
        }
    }

    private async getProduct(productId: string): Promise<Product> {
        const product = await this._catalogFacade.find({ id: productId });

        if (!product) {
            throw new Error(`Product ${productId} not found`);
        }

        const productProps = {
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        };

        return new Product(productProps);
    }

    private async generateInvoice(client: Client, products: Product[]): Promise<OutputGenerateInvoiceFacadeDto> {
        return await this._invoiceFacade.generate({
            name: client.name,
            document: client.document,
            street: client.street,
            complement: client.complement,
            number: client.number,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            items: products.map((product) => {
                return {
                    id: product.id.id,
                    name: product.name,
                    price: product.salesPrice,
                }
            }),
        });
    }

}