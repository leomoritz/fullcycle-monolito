import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Product from "../../domain/product.entity";
import ProductGateway from "../../gateway/product.gateway";
import { InputAddProductDto, OutputAddProductDto } from "./add-product.dto";

export default class AddProductUseCase implements UseCaseInterface<InputAddProductDto, OutputAddProductDto> {
    private _productRepository: ProductGateway;

    constructor(repository: ProductGateway) {
        this._productRepository = repository;
    }

    async execute(input: InputAddProductDto): Promise<OutputAddProductDto> {
        const props = {
            id: new Id(input.id),
            name: input.name,
            description: input.description,
            purchasePrice: input.purchasePrice,
            salesPrice: input.salesPrice,
            stock: input.stock
        };
        const product = new Product(props);
        
        this._productRepository.add(product);

        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            salesPrice: product.salesPrice,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,    
        };
    }
}