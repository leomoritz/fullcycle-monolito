import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientGateway from "../../gateway/client.gateway";
import { InputFindClientUseCaseDto, OutputFindClientUseCaseDto } from "./find-client.usecase.dto";

export default class FindClientUseCase implements UseCaseInterface<InputFindClientUseCaseDto, OutputFindClientUseCaseDto> {
    constructor(private clientRepository: ClientGateway) {}

    async execute(input: InputFindClientUseCaseDto): Promise<OutputFindClientUseCaseDto> {
        const client = await this.clientRepository.find(input.id);
        return {
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        };
    }
}