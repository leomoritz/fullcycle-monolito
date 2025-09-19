import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import ProductAdmFacadeFactory from "./product-adm.facade.factory";

describe("ProductAdmFacade test", () => {
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

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        // Arrange
        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "ea4af73d-8132-42ec-99f2-b3508336f733",
            name: "Vela de ingnição",
            description: "Marca XTPO",
            purchasePrice: 100,
            stock: 10
        };

        // Act
        productFacade.addProduct(input);

        // Assert
        const product = await ProductModel.findOne({ where: { id: input.id } });
        expect(product).toBeDefined();
        expect(product.id).toBe(input.id);
        expect(product.name).toBe(input.name);
        expect(product.description).toBe(input.description);
        expect(product.purchasePrice).toBe(input.purchasePrice);
        expect(product.stock).toBe(input.stock);
        expect(product.createdAt).toBeDefined();
        expect(product.updatedAt).toBeDefined();
    });
});