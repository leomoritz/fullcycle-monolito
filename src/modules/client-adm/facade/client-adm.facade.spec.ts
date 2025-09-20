import { Sequelize } from "sequelize-typescript";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";

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
        const repository = new ClientRepository();
        const addUseCase = new AddClientUseCase(repository);
        const facade = new ClientAdmFacade({
            addUsecase: addUseCase,
            findUsecase: undefined
        });

        const input = {
            id: "ac1c4323-ff10-41cb-9c78-dceba3765c86",
            name: "Client 1",
            email: "client1@example.com",
            address: "Address 1"
        };


        // Act
        await facade.add(input);

        // Assert
        const clientDb = await ClientModel.findByPk(input.id);
        expect(clientDb).toBeDefined();
        expect(clientDb.id).toEqual(input.id);
        expect(clientDb.name).toEqual(input.name);
        expect(clientDb.email).toEqual(input.email);
        expect(clientDb.address).toEqual(input.address);
        expect(clientDb.createdAt).toEqual(expect.any(Date));
        expect(clientDb.updatedAt).toEqual(expect.any(Date));
    });

    it("should find a client", async () => {
        // Arrange
        const repository = new ClientRepository();
        const findUseCase = new FindClientUseCase(repository);
        const facade = new ClientAdmFacade({
            addUsecase: undefined,
            findUsecase: findUseCase
        });

        const input = {
            id: "5be6e1ab-010a-4ee4-af83-37f34e9602c4"
        }

        const props = {
            id: input.id,
            name: "Client 1",
            email: "client1@example.com",
            address: "Address 1",
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
        expect(result.address).toEqual(props.address);
        expect(result.createdAt).toEqual(expect.any(Date));
        expect(result.updatedAt).toEqual(expect.any(Date));
    });
});