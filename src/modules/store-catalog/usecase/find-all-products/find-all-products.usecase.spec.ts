import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindAllProductUseCase from "./find-all-products.usecase";

const productOne = new Product({
    id: new Id("ea04bdb5-53a4-4634-9c0d-34c5ec5e45e9"),
    name: "Velas de ignição",
    description: "Marca XPTO",
    salesPrice: 125,
});

const productTwo = new Product({
    id: new Id("927110cd-c9aa-4d5f-a363-4153e2db1612"),
    name: "Disco de Freio Sólido",
    description: "Marca XPTO",
    salesPrice: 300,
});

const MockRepository = () => {
    return {
        findAll: jest.fn().mockReturnValue(Promise.resolve([productOne, productTwo])),
        find: jest.fn(),
    }
};

describe("Find all products usecase unit test", () => {
    it("should find all products", async () => {
        // Arrange
        const productRepository = MockRepository();
        const usecase = new FindAllProductUseCase(productRepository);

        // Act
        const result = await usecase.execute({});

        // Assert
        expect(productRepository.findAll).toHaveBeenCalled();
        expect(result.products).toHaveLength(2);

        const resultOne = result.products[0];
        expect(resultOne.id).toBe(productOne.id.id);
        expect(resultOne.name).toBe(productOne.name);
        expect(resultOne.description).toBe(productOne.description);
        expect(resultOne.salesPrice).toBe(productOne.salesPrice);

        const resultTwo = result.products[1];
        expect(resultTwo.id).toBe(productTwo.id.id);
        expect(resultTwo.name).toBe(productTwo.name);
        expect(resultTwo.description).toBe(productTwo.description);
        expect(resultTwo.salesPrice).toBe(productTwo.salesPrice);
    });
});