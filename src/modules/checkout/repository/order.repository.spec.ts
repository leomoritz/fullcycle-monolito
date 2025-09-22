import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import { ClientModel } from "../../client-adm/repository/client.model";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import { OrderItemModel } from "./order-item.model";
import OrderModel from "./order.model";
import { OrderRepository } from "./order.repository";
import ProductModel from "../../store-catalog/repository/product.model";

describe("OrderRepository test", () => {
    let sequlize: Sequelize;

    beforeEach(async () => {
        sequlize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequlize.addModels([OrderModel, OrderItemModel, ClientModel, ProductModel]);
        await sequlize.sync();
    });

    afterEach(async () => {
        await sequlize.close();
    });


    it("should create a new order", async () => {
        // Arrange
        const clientModel = await ClientModel.create({
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

        const productsModel = await ProductModel.bulkCreate([
            {
                id: "c2ef74ae-ae1f-4a3e-ba3f-fad687fecf4c",
                name: "Product 1",
                description: "Description 1",
                salesPrice: 100,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "eac4387d-94e5-46c9-ac48-0ce383f0aa79",
                name: "Product 2",
                description: "Description 2",
                salesPrice: 200,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        const orderProps = {
            id: new Id("fed886ad-4fae-4ece-9187-3e67f53d715f"),
            client: new Client({
                id: new Id(clientModel.id),
                name: clientModel.name,
                email: clientModel.email,
                document: clientModel.document,
                street: clientModel.street,
                number: clientModel.number,
                complement: clientModel.complement,
                city: clientModel.city,
                state: clientModel.state,
                zipCode: clientModel.zipCode
            }),
            products: productsModel.map(product => new Product({
                id: new Id(product.id),
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
                quantity: 1
            })),
        };

        const order = new Order(orderProps);
        const orderRepository = new OrderRepository();

        // Act
        await orderRepository.addOrder(order);

        // Assert
        const orderModel = await OrderModel.findOne({
            where: { id: order.id.id },
            include: [{ model: OrderItemModel }, { model: ClientModel }]
        });
        expect(orderModel).toBeDefined();
        expect(orderModel.id).toBe(order.id.id);
        expect(orderModel.client.id).toBe(order.client.id.id);
        expect(orderModel.items.length).toBe(2);
        expect(orderModel.items[0].productId).toBe(order.products[0].id.id);
        expect(orderModel.items[0].quantity).toBe(1);
        expect(orderModel.items[1].productId).toBe(order.products[1].id.id);
        expect(orderModel.items[1].quantity).toBe(1);
    });

    it("should find an order by id", async () => {
        // Arrange
        const clientModel = await ClientModel.create({
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

        const productsModel = await ProductModel.bulkCreate([
            {
                id: "c2ef74ae-ae1f-4a3e-ba3f-fad687fecf4c",
                name: "Product 1",
                description: "Description 1",
                salesPrice: 100,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "eac4387d-94e5-46c9-ac48-0ce383f0aa79",
                name: "Product 2",
                description: "Description 2",
                salesPrice: 200,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        const orderCreated = await OrderModel.create({
            id: "612507bf-f30e-4312-bccc-e6f754f5cd2b",
            clientId: clientModel.id,
            items: productsModel.map(product => ({
                id: product.id,
                productId: product.id,
                quantity: 1,
            })),
        }, {
            include: [OrderItemModel]
        });

        const orderRepository = new OrderRepository();

        // Act
        const foundOrder = await orderRepository.findOrder(orderCreated.id);

        // Assert
        expect(foundOrder).toBeDefined();
        expect(foundOrder.id.id).toBe(orderCreated.id);
        expect(foundOrder.client.id.id).toBe(clientModel.id);
        expect(foundOrder.products[0].id.id).toBe(orderCreated.items[0].id);
        expect(foundOrder.products[0].name).toBe("Product 1");
        expect(foundOrder.products[0].description).toBe("Description 1");
        expect(foundOrder.products[0].salesPrice).toBe(100);
        expect(foundOrder.products[0].quantity).toBe(1);
        expect(foundOrder.products[1].id.id).toBe(orderCreated.items[1].id);
        expect(foundOrder.products[1].name).toBe("Product 2");
        expect(foundOrder.products[1].description).toBe("Description 2");
        expect(foundOrder.products[1].salesPrice).toBe(200);
        expect(foundOrder.products[1].quantity).toBe(1);
    });

    it("should throw an error when order is not found", async () => {
        // Arrange
        const orderRepository = new OrderRepository();

        // Act & Assert
        await expect(orderRepository.findOrder("a026dcd8-949b-410d-97d6-6c5beebb4ae7")).rejects.toThrow("Order not found");
    });
});