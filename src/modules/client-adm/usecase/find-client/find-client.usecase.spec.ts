import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
    id: new Id("90de4457-67d6-4b43-9a40-a6d2dfa99b85"),
    name: "Client 1",
    email: "client1@example.com",
    address: "Address 1",
})

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
  };
};

describe("FindClientUseCase unit test", () => {
  it("should find a client", async () => {
    const clientRepository = MockRepository();
    const usecase = new FindClientUseCase(clientRepository);

    const input = {
      id: "90de4457-67d6-4b43-9a40-a6d2dfa99b85",
    };

    const output = await usecase.execute(input);

    expect(output).toEqual({
        id: "90de4457-67d6-4b43-9a40-a6d2dfa99b85",
        name: "Client 1",
        email: "client1@example.com",
        address: "Address 1",
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
    });
  });
});