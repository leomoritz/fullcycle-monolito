import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("ClientRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([ClientModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should add a client", async () => {
        // Arrange
        const props = {
            id: new Id("ac1c4323-ff10-41cb-9c78-dceba3765c86"),
            name: "Client 1",
            email: "client1@example.com",
            document: "Document 1",
            street: "Street 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "ZipCode 1",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const client = new Client(props);
        
        // Act
        const repository = new ClientRepository();
        await repository.add(client);
        const clientDb = await ClientModel.findByPk(props.id.id);
        
        // Assert
        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(client.id.id);
        expect(clientDb.name).toEqual(client.name);
        expect(clientDb.email).toEqual(client.email);
        expect(clientDb.document).toEqual(client.document);
        expect(clientDb.street).toEqual(client.street);
        expect(clientDb.number).toEqual(client.number);
        expect(clientDb.complement).toEqual(client.complement);
        expect(clientDb.city).toEqual(client.city);
        expect(clientDb.state).toEqual(client.state);
        expect(clientDb.zipCode).toEqual(client.zipCode);
        expect(clientDb.createdAt).toEqual(client.createdAt);
        expect(clientDb.updatedAt).toEqual(client.updatedAt);
    });

    it("should find a client", async () => {
        // Arrange
        const props = {
            id: "ac1c4323-ff10-41cb-9c78-dceba3765c86",
            name: "Client 1",
            email: "client1@example.com",
            document: "Document 1",
            street: "Street 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "ZipCode 1",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await ClientModel.create(props);

        // Act
        const repository = new ClientRepository();
        const result = await repository.find(props.id);

        // Assert
        expect(result).toBeDefined();
        expect(result.id.id).toEqual(props.id);
        expect(result.name).toEqual(props.name);
        expect(result.email).toEqual(props.email);
        expect(result.document).toEqual(props.document);
        expect(result.street).toEqual(props.street);
        expect(result.number).toEqual(props.number);
        expect(result.complement).toEqual(props.complement);
        expect(result.city).toEqual(props.city);
        expect(result.state).toEqual(props.state);
        expect(result.zipCode).toEqual(props.zipCode);
        expect(result.createdAt).toEqual(expect.any(Date));
        expect(result.updatedAt).toEqual(expect.any(Date));
    });
});