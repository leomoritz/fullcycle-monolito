import { InputAddProductFacadeDto, InputCheckStockFacadeDto, OutputCheckStockFacadeDto } from "./product-adm.facade.dto";

export default interface ProductAdmFacadeInterface {
    addProduct(input: InputAddProductFacadeDto): Promise<void>;
    checkStock(input: InputCheckStockFacadeDto): Promise<OutputCheckStockFacadeDto>;
}