import express, { Express } from 'express'
import request from "supertest"
import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import { migrator } from '../../../../infra/migrations/config/migrator';
import { clientAdmRouter } from '../routes/client-adm.route';
import { ClientModel } from '../../repository/client.model';

describe("E2E test for client-adm", () => {
    const app: Express = express()
    app.use(express.json())
    app.use("/clients", clientAdmRouter)

    let sequelize: Sequelize

    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        })

        sequelize.addModels([ClientModel])
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

    it("should create a client", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
                name: "John Doe",
                email: "john.doe@example.com",
                document: "12345678901",
                street: "Main St",
                number: "123",
                complement: "Apt 1",
                city: "Anytown",
                state: "CA",
                zipCode: "12345"
            });

        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe("John Doe");
        expect(response.body.email).toBe("john.doe@example.com");
        expect(response.body.document).toBe("12345678901");
        expect(response.body.street).toBe("Main St");
        expect(response.body.number).toBe("123");
        expect(response.body.complement).toBe("Apt 1");
        expect(response.body.city).toBe("Anytown");
        expect(response.body.state).toBe("CA");
        expect(response.body.zipCode).toBe("12345");
    });

});