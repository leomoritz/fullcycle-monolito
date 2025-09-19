import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

const product = new Product({
    id: new Id("ea04bdb5-53a4-4634-9c0d-34c5ec5e45e9"),
    name: "Velas de ignição",
    description: "Marca XPTO",
    purchasePrice: 100,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date()
});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product))
    }
}

describe("Check stock usecase unit test", () => {
    it("should get stock of a product", async () => {
        // Arrange
        const productRepository = MockRepository();
        const usecase = new CheckStockUseCase(productRepository);

        // Act
        const output = await usecase.execute({ productId: product.id.id });

        // Assert
        expect(productRepository.find).toHaveBeenCalled();
        expect(output.productId).toEqual(product.id.id);
        expect(output.stock).toBe(product.stock);
    });
});