import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { InputAddProductDto, OutputAddProductDto } from "../usecase/add-product/add-product.dto";
import { InputAddProductFacadeDto, InputCheckStockFacadeDto, OutputCheckStockFacadeDto } from "./product-adm.facade.dto";
import ProductAdmFacadeInterface from "./product-adm.facade.interface";

export interface UseCaseProps {
    addProductUseCase?: UseCaseInterface<InputAddProductDto, OutputAddProductDto>;
    checkStockUseCase?: UseCaseInterface<any, any>;
}


export default class ProductAdmFacade implements ProductAdmFacadeInterface {
    private _addProductUseCase: UseCaseInterface<InputAddProductDto, OutputAddProductDto>;
    private _checkStockUseCase: UseCaseInterface<any, any>;

    constructor(usecaseProps: UseCaseProps) {
        this._addProductUseCase = usecaseProps.addProductUseCase;
        this._checkStockUseCase = usecaseProps.checkStockUseCase;
    }

    addProduct(input: InputAddProductFacadeDto): Promise<void> {
        this._addProductUseCase.execute(input); // não é necessário converter o dto da facade pois possui o mesmo contrato do dto do usecase.
        return;
    }
    checkStock(input: InputCheckStockFacadeDto): Promise<OutputCheckStockFacadeDto> {
        return this._checkStockUseCase.execute(input);
    }

}