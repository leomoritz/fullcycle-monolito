import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";

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

describe("Find product usecase unit test", () => {
    it("should return a product", async () => {
        const productRepository = MockRepository();
        const usecase = new FindProductUseCase(productRepository);

        const output = await usecase.execute({ id: product.id.id });

        expect(productRepository.find).toHaveBeenCalled();
        expect(output.id).toEqual(product.id.id);
        expect(output.name).toBe(product.name);
        expect(output.description).toBe(product.description);
        expect(output.purchasePrice).toBe(product.purchasePrice);
        expect(output.stock).toBe(product.stock);
        expect(output.createdAt).toEqual(product.createdAt);
        expect(output.updatedAt).toEqual(product.updatedAt);
    });
});