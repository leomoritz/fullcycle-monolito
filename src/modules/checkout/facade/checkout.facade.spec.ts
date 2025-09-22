import { Sequelize } from "sequelize-typescript";
import OrderModel from "../repository/order.model";
import { OrderItemModel } from "../repository/order-item.model";
import ProductModel from "../../store-catalog/repository/product.model";
import { ProductModel as ProductAdmModel } from "../../product-adm/repository/product.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import CheckoutFacadeFactory from "../factory/facade.factory";
import InvoiceModel from "../../invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../invoice/repository/invoice-item.model";

describe("CheckoutFacade test", () => {
    let sequlize: Sequelize;

    beforeEach(async () => {
        sequlize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequlize.addModels([OrderModel, OrderItemModel, ClientModel, ProductModel, ProductAdmModel, InvoiceModel, InvoiceItemModel]);
        await sequlize.sync();
    });

    afterEach(async () => {
        await sequlize.close();
    });

    it("should place a order", async () => {
        // Arrange
        const client = await ClientModel.create({
            id: "a79919ed-5b6c-479f-b1c1-46f03200d64f",
            name: "Client 1",
            email: "client1@example.com",
            document: "12345678901",
            street: "Street 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345678",
            createdAt: new Date(),
            updatedAt: new Date(),
        });


        const products = await ProductModel.bulkCreate([
            {
                id: "c2ef74ae-ae1f-4a3e-ba3f-fad687fecf4c",
                name: "Product 1",
                description: "Description 1",
                salesPrice: 100
            },
            {
                id: "eac4387d-94e5-46c9-ac48-0ce383f0aa79",
                name: "Product 2",
                description: "Description 2",
                salesPrice: 200
            }
        ]);

        const input = {
            clientId: client.id,
            products: products.map(product => ({ productId: product.id }))
        };

        // Act
        const checkoutFacade = CheckoutFacadeFactory.create();
        const output = await checkoutFacade.placeOrder(input);

        // Assert
        const orderCreatedFull = await OrderModel.findOne({
            where: { id: output.id },
            include: [
                { model: OrderItemModel, include: [ProductModel] },
                ClientModel
            ]
        });

        expect(orderCreatedFull).toBeDefined();
        expect(orderCreatedFull.id).toBe(output.id);
        expect(orderCreatedFull.clientId).toBe(input.clientId);
        expect(orderCreatedFull.items.length).toBe(2);
        expect(orderCreatedFull.items[0].product.id).toBe("c2ef74ae-ae1f-4a3e-ba3f-fad687fecf4c");
        expect(orderCreatedFull.items[1].product.id).toBe("eac4387d-94e5-46c9-ac48-0ce383f0aa79");
        expect(output.total).toBe(300);

        const invoiceGenerated = await InvoiceModel.findOne({
            where: { document: client.document }
        });
        expect(invoiceGenerated).toBeDefined();
        expect(invoiceGenerated.items).toHaveLength(2);
    });

});