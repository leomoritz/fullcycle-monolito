import { Sequelize } from "sequelize-typescript"
import { ProductModel } from "./product.model";
import Product from "../domain/product.entity";
import ProductRepository from "./product.repository";

describe("ProductRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        // Arrange
        const props = {
            name: "Velas de ignição",
            description: "Marca XPTO",
            purchasePrice: 100,
            stock: 10
        }
        const product = new Product(props);
        const productRepository = new ProductRepository();

        // Act
        await productRepository.add(product);

        // Assert
        const productDb = await ProductModel.findOne({ where: { id: product.id.id } });
        expect(productDb.id).toEqual(product.id.id);
        expect(productDb.name).toEqual(product.name);
        expect(productDb.description).toEqual(product.description);
        expect(productDb.purchasePrice).toEqual(product.purchasePrice);
        expect(productDb.stock).toEqual(product.stock);
        expect(productDb.createdAt).toBeDefined();
        expect(productDb.updatedAt).toBeDefined();
    });

    it("should find a product", async () => {
        const productRepository = new ProductRepository();

        await ProductModel.create({
            id: "3be3999d-3f3d-4698-890c-ef01ee7fe690",
            name: "Disco de freio sólido",
            description: "Disco para freio marca XPTO",
            purchasePrice: 238,
            stock: 3,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const product = await productRepository.find("3be3999d-3f3d-4698-890c-ef01ee7fe690");

        expect(product.id.id).toEqual("3be3999d-3f3d-4698-890c-ef01ee7fe690");
        expect(product.name).toEqual("Disco de freio sólido");
        expect(product.description).toEqual("Disco para freio marca XPTO");
        expect(product.purchasePrice).toEqual(238);
        expect(product.stock).toEqual(3);
        expect(product.createdAt).toBeDefined();
        expect(product.updatedAt).toBeDefined();
    });

    it("should throw error when product not found", async () => {
        const productRepository = new ProductRepository();
        const productId = "c041f722-d3da-4a6c-9e93-4bd2bc5873180";
        await expect(() => productRepository.find(productId))
            .rejects.toThrow(`Product with id ${productId} not found`);
    });
})