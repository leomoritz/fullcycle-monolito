import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";
import { InputCheckStockDto, OutputCheckStockDto } from "./check-stock.dto";

export default class CheckStockUseCase implements UseCaseInterface<InputCheckStockDto, OutputCheckStockDto> {
    private _productRepository: ProductGateway;

    constructor(productRepository: ProductGateway) {
        this._productRepository = productRepository;
    }

    async execute(input: InputCheckStockDto): Promise<OutputCheckStockDto> {
        const product = await this._productRepository.find(input.productId);

        return {
            productId: product.id.id,
            stock: product.stock,
        };
    }

}