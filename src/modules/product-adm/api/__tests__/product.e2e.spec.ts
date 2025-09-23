import { ProductModel } from '../../repository/product.model';
import express, { Express } from 'express'
import request from "supertest"
import { productAdmRouter } from '../routes/product-adm.route';
import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import { migrator } from '../../../../infra/migrations/config/migrator';

describe("E2E test for product-adm", () => {
    const app: Express = express()
    app.use(express.json())
    app.use("/products", productAdmRouter)

    let sequelize: Sequelize

    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        })

        sequelize.addModels([ProductModel])
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

    it("should create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                name: "Teclado & Mouse Logitech",
                purchasePrice: 50,
                salesPrice: 100,
                stock: 10,
                description: "Teclado e Mouse sem fio Logitech"
            });

        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe("Teclado & Mouse Logitech");
        expect(response.body.purchasePrice).toBe(50);
        expect(response.body.salesPrice).toBe(100);
        expect(response.body.stock).toBe(10);
        expect(response.body.description).toBe("Teclado e Mouse sem fio Logitech");
    });

});