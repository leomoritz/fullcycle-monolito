import ProductAdmFacade from "./product-adm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import CheckStockUseCase from "../usecase/check-stock/check-stock.usecase";

export default class ProductAdmFacadeFactory {
    static create() {
        const productRepository = new ProductRepository();
        const addProductUseCase = new AddProductUseCase(productRepository);
        const findProductUseCase = new FindProductUseCase(productRepository);
        const checkStockUseCase = new CheckStockUseCase(productRepository);
        const productFacade = new ProductAdmFacade({
            addProductUseCase: addProductUseCase,
            findStockUseCase: findProductUseCase,
            checkStockUseCase: checkStockUseCase,
        });

        return productFacade;
    }
}