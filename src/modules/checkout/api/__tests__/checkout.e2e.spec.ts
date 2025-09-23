import express, { Express } from 'express'
import request from "supertest"
import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import { migrator } from '../../../../infra/migrations/config/migrator';
import { checkoutRouter } from '../routes/checkout.route';
import OrderModel from '../../repository/order.model';
import { OrderItemModel } from '../../repository/order-item.model';
import { ClientModel } from '../../../client-adm/repository/client.model';
import ProductModel from '../../../store-catalog/repository/product.model';
import { ProductModel as ProductAdmModel } from '../../../product-adm/repository/product.model';
import InvoiceModel from '../../../invoice/repository/invoice.model';
import { InvoiceItemModel } from '../../../invoice/repository/invoice-item.model';
import TransactionModel from '../../../payment/repository/transaction.model';

describe("E2E test for checkout", () => {
    const app: Express = express()
    app.use(express.json())
    app.use("/checkouts", checkoutRouter)

    let sequelize: Sequelize

    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        })

        sequelize.addModels([
            OrderModel,
            OrderItemModel,
            ClientModel,
            ProductModel,
            ProductAdmModel,
            InvoiceModel,
            InvoiceItemModel,
            TransactionModel
        ])
        migration = migrator(sequelize)
        await migration.up()
    })

    afterEach(async () => {
        if (!migration || !sequelize) {
            return
        }
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    })

    it("should place order", async () => {
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
            updatedAt: new Date()
        });

        const products = await ProductAdmModel.bulkCreate([
            {
                id: "c2ef74ae-ae1f-4a3e-ba3f-fad687fecf4c",
                name: "Product 1",
                description: "Description 1",
                stock: 10,
                purchasePrice: 50,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: "eac4387d-94e5-46c9-ac48-0ce383f0aa79",
                name: "Product 2",
                description: "Description 2",
                stock: 10,
                purchasePrice: 100,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        await ProductModel.update(
            { salesPrice: 100, createdAt: new Date(), updatedAt: new Date() },
            { where: { id: "c2ef74ae-ae1f-4a3e-ba3f-fad687fecf4c" } }
        );
        await ProductModel.update(
            { salesPrice: 200, createdAt: new Date(), updatedAt: new Date() },
            { where: { id: "eac4387d-94e5-46c9-ac48-0ce383f0aa79" } }
        );

        const input = {
            clientId: client.id,
            products: products.map(product => ({ productId: product.id }))
        };

        const response = await request(app)
            .post("/checkouts")
            .send(input);

        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.status).toBe("approved");
        expect(response.body.products).toHaveLength(2);
        expect(response.body.products[0].productId).toBe(products[0].id);
        expect(response.body.products[1].productId).toBe(products[1].id);
        expect(response.body.total).toBe(300);
        expect(response.body.invoiceId).toBeDefined();
        const invoiceGenerated = await InvoiceModel.findOne({
            where: { id: response.body.invoiceId },
            include: [{ model: InvoiceItemModel }]
        });
        expect(invoiceGenerated).toBeDefined();
        expect(invoiceGenerated.items).toHaveLength(2);
    });

});