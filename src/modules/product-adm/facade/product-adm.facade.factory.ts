import ProductAdmFacade from "./product-adm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";

export default class ProductAdmFacadeFactory {
    static create() {
        const productRepository = new ProductRepository();
        const addProductUseCase = new AddProductUseCase(productRepository);
        const findProductUseCase = new FindProductUseCase(productRepository);
        const productFacade = new ProductAdmFacade({
            addProductUseCase: addProductUseCase,
            findStockUseCase: findProductUseCase
        });

        return productFacade;
    }
}