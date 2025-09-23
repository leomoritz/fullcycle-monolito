import express, { Express } from 'express'
import request from "supertest"
import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import { migrator } from '../../../../infra/migrations/config/migrator';
import { invoiceRouter } from '../routes/invoice.route';
import InvoiceModel from '../../repository/invoice.model';
import { InvoiceItemModel } from '../../repository/invoice-item.model';

describe("E2E test for invoice", () => {
    const app: Express = express();
    app.use(express.json());
    app.use("/invoices", invoiceRouter);

    let sequelize: Sequelize;

    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        })

        sequelize.addModels([InvoiceModel, InvoiceItemModel])
        migration = migrator(sequelize)
        await migration.up()

        await InvoiceModel.create({
            id: "f3ab82f0-6a35-4375-93fa-bc728a23d1ac",
            name: "John Doe",
            document: "12345678901",
            street: "Main St",
            number: "123",
            complement: "Apt 1",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            items: [
                {
                    id: "5fc3b2aa-aaff-4e78-bee3-785c397f86e6",
                    name: "Product 1",
                    price: 100
                }
            ],
            total: 100,
            createdAt: new Date(),
            updatedAt: new Date()
        }, { include: [{ model: InvoiceItemModel }] });
    });

    afterEach(async () => {
        if (!migration || !sequelize) {
            return
        }
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    });

    it("should find invoice by id", async () => {
        const response = await request(app)
            .get("/invoices/f3ab82f0-6a35-4375-93fa-bc728a23d1ac");

        expect(response.status).toBe(200);
        expect(response.body.id).toBe("f3ab82f0-6a35-4375-93fa-bc728a23d1ac");
        expect(response.body.name).toBe("John Doe");
        expect(response.body.document).toBe("12345678901");
        expect(response.body.address.street).toBe("Main St");
        expect(response.body.address.number).toBe("123");
        expect(response.body.address.complement).toBe("Apt 1");
        expect(response.body.address.city).toBe("Anytown");
        expect(response.body.address.state).toBe("CA");
        expect(response.body.address.zipCode).toBe("12345");
        expect(response.body.items.length).toBe(1);
        expect(response.body.items[0].id).toBe("5fc3b2aa-aaff-4e78-bee3-785c397f86e6");
        expect(response.body.items[0].name).toBe("Product 1");
        expect(response.body.items[0].price).toBe(100);
        expect(response.body.total).toBe(100);
    });

});