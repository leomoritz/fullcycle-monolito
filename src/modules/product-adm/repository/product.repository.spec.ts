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
})