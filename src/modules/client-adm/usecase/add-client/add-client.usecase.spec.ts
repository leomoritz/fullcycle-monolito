import Client from "../../domain/client.entity";
import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    };
};

describe("AddClientUseCase unit test", () => {
    it("should add a client", async () => {
        // Arrange
        const clientRepository = MockRepository();
        const usecase = new AddClientUseCase(clientRepository);

        const input = {
            id: "c771ccc3-13d4-4d04-a5fe-70bd13edffb7",
            name: "Client 1",
            email: "client1@example.com",
            address: "Address 1",
        };

        // Act
        const output = await usecase.execute(input);

        // Assert
        expect(clientRepository.add).toHaveBeenCalledWith(expect.any(Client));
        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            email: input.email,
            address: input.address,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });
});