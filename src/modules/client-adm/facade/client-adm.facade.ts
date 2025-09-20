import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { InputAddClientUseCaseDto, OutputAddClientUseCaseDto } from "../usecase/add-client/add-client.usecase.dto";
import { InputFindClientUseCaseDto, OutputFindClientUseCaseDto } from "../usecase/find-client/find-client.usecase.dto";
import { InputAddClientFacadeDto, InputFindClientFacadeDto, OutputFindClientFacadeDto } from "./client-adm.facade.dto";
import ClientAdmFacadeInterface from "./client-adm.facade.interface";

export type UseCaseProps = {
    addUsecase: UseCaseInterface<InputAddClientUseCaseDto, OutputAddClientUseCaseDto>,
    findUsecase: UseCaseInterface<InputFindClientUseCaseDto, OutputFindClientUseCaseDto>
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
    private _addUsecase: UseCaseInterface<InputAddClientUseCaseDto, OutputAddClientUseCaseDto>;
    private _findUsecase: UseCaseInterface<InputFindClientUseCaseDto, OutputFindClientUseCaseDto>;

    constructor(props: UseCaseProps) {
        this._addUsecase = props.addUsecase;
        this._findUsecase = props.findUsecase;
    }

    async add(input: InputAddClientFacadeDto): Promise<void> {
        await this._addUsecase.execute(input);
    }

    async find(input: InputFindClientFacadeDto): Promise<OutputFindClientFacadeDto> {
        const client = await this._findUsecase.execute(input);

        return {
            id: client.id,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt
        };
    }
}