import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";
import { InputFindProductDto, OutputFindProductDto } from "./find-product.dto";

export default class FindProductUseCase implements UseCaseInterface<InputFindProductDto, OutputFindProductDto> {
    constructor(private _productRepository: ProductGateway) { }

    async execute(input: InputFindProductDto): Promise<OutputFindProductDto> {
        const product = await this._productRepository.find(input.id);

        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice
        }
    }

}