import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { InputAddProductDto, OutputAddProductDto } from "../usecase/add-product/add-product.dto";
import { InputFindProductDto, OutputFindProductDto } from "../usecase/find-product/find-product.dto";
import { InputAddProductFacadeDto, InputFindProductFacadeDto, OutputFindProductFacadeDto } from "./product-adm.facade.dto";
import ProductAdmFacadeInterface from "./product-adm.facade.interface";

export interface UseCaseProps {
    addProductUseCase?: UseCaseInterface<InputAddProductDto, OutputAddProductDto>;
    findStockUseCase?: UseCaseInterface<InputFindProductDto, OutputFindProductDto>;
}


export default class ProductAdmFacade implements ProductAdmFacadeInterface {
    private _addProductUseCase: UseCaseInterface<InputAddProductDto, OutputAddProductDto>;
    private _findStockUseCase: UseCaseInterface<InputFindProductDto, OutputFindProductDto>;

    constructor(usecaseProps: UseCaseProps) {
        this._addProductUseCase = usecaseProps.addProductUseCase;
        this._findStockUseCase = usecaseProps.findStockUseCase;
    }

    addProduct(input: InputAddProductFacadeDto): Promise<void> {
        this._addProductUseCase.execute(input); // não é necessário converter o dto da facade pois possui o mesmo contrato do dto do usecase.
        return;
    }
    findProduct(input: InputFindProductFacadeDto): Promise<OutputFindProductFacadeDto> {
        return this._findStockUseCase.execute(input);
    }

}