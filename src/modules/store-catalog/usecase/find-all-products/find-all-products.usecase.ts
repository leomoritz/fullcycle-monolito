import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";
import { InputFindAllProductsDto, OutputFindAllProductsDto } from "./find-all-products.dto";

export default class FindAllProductUseCase implements UseCaseInterface<InputFindAllProductsDto, OutputFindAllProductsDto> {
    constructor(private _productRepository: ProductGateway) {} // injeta automaticamente
    
    async execute(input: InputFindAllProductsDto): Promise<OutputFindAllProductsDto> {
        const products = await this._productRepository.findAll();

        return {
            products: products.map((product) => ({
                id: product.id.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice
            })),
        };
    }

}