import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";

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

    it("should find a client", async () => {
        // Arrange
        const props = {
            id: "ac1c4323-ff10-41cb-9c78-dceba3765c86",
            name: "Client 1",
            email: "client1@example.com",
            address: "Address 1",
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
        expect(result.address).toEqual(props.address);
        expect(result.createdAt).toEqual(expect.any(Date));
        expect(result.updatedAt).toEqual(expect.any(Date));
    });
});