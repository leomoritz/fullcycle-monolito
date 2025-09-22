import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "./facade.factory";

describe("StoreCatalogFacade test", () => {
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

    it("should find a product", async () => {
        // Arrange
        const facade = StoreCatalogFacadeFactory.create();
        await ProductModel.create({
            id: "0f46d25d-0b26-4bba-844a-0ea7d130ebed",
            name: "Vela de ignição",
            description: "Marca XPTO",
            salesPrice: 100,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Act
        const result = await facade.find({
            id: "0f46d25d-0b26-4bba-844a-0ea7d130ebed"
        });

        // Assert
        expect(result.id).toBe("0f46d25d-0b26-4bba-844a-0ea7d130ebed");
        expect(result.name).toBe("Vela de ignição");
        expect(result.description).toBe("Marca XPTO");
        expect(result.salesPrice).toBe(100);
    })

    it("should find all products", async () => {
        // Arrange
        await ProductModel.create({
            id: "0f46d25d-0b26-4bba-844a-0ea7d130ebed",
            name: "Vela de ignição",
            description: "Marca XPTO",
            salesPrice: 100,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await ProductModel.create({
            id: "0edfd09d-d303-4df7-9200-c8f3a06c5dd5",
            name: "Disco de freio sólido",
            description: "Marca XPTO",
            salesPrice: 300,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const facade = StoreCatalogFacadeFactory.create();

        // Act
        const results = await facade.findAll({});

        // Assert
        expect(results.products).toHaveLength(2);

        const resultOne = results.products[0];
        expect(resultOne.id).toBe("0f46d25d-0b26-4bba-844a-0ea7d130ebed");
        expect(resultOne.name).toBe("Vela de ignição");
        expect(resultOne.description).toBe("Marca XPTO");
        expect(resultOne.salesPrice).toBe(100);

        const resultTwo = results.products[1];
        expect(resultTwo.id).toBe("0edfd09d-d303-4df7-9200-c8f3a06c5dd5");
        expect(resultTwo.name).toBe("Disco de freio sólido");
        expect(resultTwo.description).toBe("Marca XPTO");
        expect(resultTwo.salesPrice).toBe(300);
    });
});