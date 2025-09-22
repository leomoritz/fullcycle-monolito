import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientAdmFacadeFactory from "./client-adm.facade.factory";

describe("ClientAdmFacade test", () => {
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

    it("should create a client", async () => {
        // Arrange
        const facade = ClientAdmFacadeFactory.create();

        const input = {
            id: "ac1c4323-ff10-41cb-9c78-dceba3765c86",
            name: "Client 1",
            email: "client1@example.com",
            document: "12345678900",
            street: "Address 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345000",
        };


        // Act
        await facade.add(input);

        // Assert
        const clientDb = await ClientModel.findByPk(input.id);
        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(input.id);
        expect(clientDb.name).toEqual(input.name);
        expect(clientDb.email).toEqual(input.email);
        expect(clientDb.document).toEqual(input.document);
        expect(clientDb.street).toEqual(input.street);
        expect(clientDb.number).toEqual(input.number);
        expect(clientDb.complement).toEqual(input.complement);
        expect(clientDb.city).toEqual(input.city);
        expect(clientDb.state).toEqual(input.state);
        expect(clientDb.zipCode).toEqual(input.zipCode);
        expect(clientDb.createdAt).toEqual(expect.any(Date));
        expect(clientDb.updatedAt).toEqual(expect.any(Date));
    });

    it("should find a client", async () => {
        // Arrange
        const facade = ClientAdmFacadeFactory.create();

        const input = {
            id: "5be6e1ab-010a-4ee4-af83-37f34e9602c4"
        }

        const props = {
            id: input.id,
            name: "Client 1",
            email: "client1@example.com",
            document: "12345678900",
            street: "Address 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345000",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await ClientModel.create(props);

        // Act
        const result = await facade.find(input);

        // Assert
        expect(result).toBeDefined();
        expect(result.id).toEqual(props.id);
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