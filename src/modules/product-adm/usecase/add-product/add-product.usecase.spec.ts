import { InputAddProductDto } from "./add-product.dto";
import AddProductUseCase from "./add-product.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn()
    }
}

describe("Add product usecase unit test", () => {
    it("should add a product", async () => {
        // Arrange
        const productRepository = MockRepository();
        const usecase = new AddProductUseCase(productRepository);
        const input = {
            name: "Velas de ignição",
            description: "Marca XPTO",
            purchasePrice: 100,
            stock: 10
        } as InputAddProductDto;

        // Act
        const output = await usecase.execute(input);

        // Assert
        expect(productRepository.add).toHaveBeenCalled();
        expect(output.id).toBeDefined();
        expect(output.name).toBe(input.name);
        expect(output.description).toBe(input.description);
        expect(output.purchasePrice).toBe(input.purchasePrice);
        expect(output.stock).toBe(input.stock);
    });
});