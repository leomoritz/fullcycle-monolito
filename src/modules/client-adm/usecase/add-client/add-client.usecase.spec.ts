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
            document: "12345678900",
            street: "Address 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345000",
        };

        // Act
        const output = await usecase.execute(input);

        // Assert
        expect(clientRepository.add).toHaveBeenCalledWith(expect.any(Client));
        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            email: input.email,
            document: input.document,
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });
});