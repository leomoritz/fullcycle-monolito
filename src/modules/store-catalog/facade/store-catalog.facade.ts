import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { InputFindAllProductsDto, OutputFindAllProductsDto } from "../usecase/find-all-products/find-all-products.dto";
import { InputFindProductDto, OutputFindProductDto } from "../usecase/find-product/find-product.dto";
import { InputFindStoreCatalogFacadeDto, OutputFindStoreCatalogFacadeDto, InputFindAllStoreCatalogFacadeDto, OutputFindAllStoreCatalogFacadeDto } from "./store-catalog.facade.dto";
import StoreCatalogFacadeInterface from "./store-catalog.facade.interface";

export interface UseCaseProps {
    findUseCase?: UseCaseInterface<InputFindProductDto, OutputFindProductDto>;
    findAllUseCase?: UseCaseInterface<InputFindAllProductsDto, OutputFindAllProductsDto>;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
    private _findUseCase: UseCaseInterface<InputFindProductDto, OutputFindProductDto>;
    private _findAllUseCase: UseCaseInterface<InputFindAllProductsDto, OutputFindAllProductsDto>;

    constructor(props: UseCaseProps) {
        this._findUseCase = props.findUseCase;
        this._findAllUseCase = props.findAllUseCase;
    }

    async find(id: InputFindStoreCatalogFacadeDto): Promise<OutputFindStoreCatalogFacadeDto> {
        return await this._findUseCase.execute(id);
    }
    
    async findAll(input: InputFindAllStoreCatalogFacadeDto): Promise<OutputFindAllStoreCatalogFacadeDto> {
        return await this._findAllUseCase.execute(input);
    }
    
}