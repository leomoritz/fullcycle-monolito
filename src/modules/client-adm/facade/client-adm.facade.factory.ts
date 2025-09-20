import Client from "../domain/client.entity";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacade from "./client-adm.facade";

export default class ClientAdmFacadeFactory {
    static create(): ClientAdmFacade {
        const clientRepository = new ClientRepository();
        const addUsecase = new AddClientUseCase(clientRepository);
        const findUsecase = new FindClientUseCase(clientRepository);

        return new ClientAdmFacade({
            addUsecase,
            findUsecase
        });
    }
}