import { InputAddProductFacadeDto, InputCheckStockFacadeDto, InputFindProductFacadeDto, OutputCheckStockFacadeDto, OutputFindProductFacadeDto } from "./product-adm.facade.dto";

export default interface ProductAdmFacadeInterface {
    addProduct(input: InputAddProductFacadeDto): Promise<void>;
    findProduct(input: InputFindProductFacadeDto): Promise<OutputFindProductFacadeDto>;
    checkStock(input: InputCheckStockFacadeDto): Promise<OutputCheckStockFacadeDto>;
}