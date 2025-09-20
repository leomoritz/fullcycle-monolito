import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import { InputAddClientUseCaseDto, OutputAddClientUseCaseDto } from "./add-client.usecase.dto";

export default class AddClientUseCase {
    constructor(private _clientRepository: ClientGateway) { }

    async execute(input: InputAddClientUseCaseDto): Promise<OutputAddClientUseCaseDto> {
        const props = {
            id: new Id(input.id),
            name: input.name,
            email: input.email,
            address: input.address,
        }

        const client = new Client(props);
        await this._clientRepository.add(client);

        return {
            id: client.id.id,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        }
    }
}