import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";

const product = new Product({
    id: new Id("ea04bdb5-53a4-4634-9c0d-34c5ec5e45e9"),
    name: "Velas de ignição",
    description: "Marca XPTO",
    salesPrice: 125,
});

const MockRepository = () => {
    return {
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
    }
};

describe("Find product usecase unit test", () => {
    it("should find product", async () => {
        // Arrange
        const productRepository = MockRepository();
        const usecase = new FindProductUseCase(productRepository);

        // Act
        const result = await usecase.execute({
            id: product.id.id
        });

        // Assert
        expect(productRepository.find).toHaveBeenCalled();
        expect(result.id).toBe(product.id.id);
        expect(result.name).toBe(product.name);
        expect(result.description).toBe(product.description);
        expect(result.salesPrice).toBe(product.salesPrice);
    });
});