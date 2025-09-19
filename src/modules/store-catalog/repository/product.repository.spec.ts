import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
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

    it("should find all products", async () => {
        // Arrange
        await ProductModel.create({
            id: "0f46d25d-0b26-4bba-844a-0ea7d130ebed",
            name: "Vela de ignição",
            description: "Marca XPTO",
            salesPrice: 100
        });

        await ProductModel.create({
            id: "0edfd09d-d303-4df7-9200-c8f3a06c5dd5",
            name: "Disco de freio sólido",
            description: "Marca XPTO",
            salesPrice: 300
        });

        const productRepository = new ProductRepository();

        // Act
        const products = await productRepository.findAll();

        // Assert
        expect(products).toHaveLength(2);

        const resultOne = products[0];
        expect(resultOne.id.id).toBe("0f46d25d-0b26-4bba-844a-0ea7d130ebed");
        expect(resultOne.name).toBe("Vela de ignição");
        expect(resultOne.description).toBe("Marca XPTO");
        expect(resultOne.salesPrice).toBe(100);

        const resultTwo = products[1];
        expect(resultTwo.id.id).toBe("0edfd09d-d303-4df7-9200-c8f3a06c5dd5");
        expect(resultTwo.name).toBe("Disco de freio sólido");
        expect(resultTwo.description).toBe("Marca XPTO");
        expect(resultTwo.salesPrice).toBe(300);
    });

     it("should find a product", async () => {
        // Arrange
        await ProductModel.create({
            id: "0f46d25d-0b26-4bba-844a-0ea7d130ebed",
            name: "Vela de ignição",
            description: "Marca XPTO",
            salesPrice: 100
        });

        const productRepository = new ProductRepository();

        // Act
        const product = await productRepository.find("0f46d25d-0b26-4bba-844a-0ea7d130ebed");

        // Assert
        expect(product.id.id).toBe("0f46d25d-0b26-4bba-844a-0ea7d130ebed");
        expect(product.name).toBe("Vela de ignição");
        expect(product.description).toBe("Marca XPTO");
        expect(product.salesPrice).toBe(100);
    });
});