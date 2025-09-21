import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("InvoiceFacade test", () => {
    let sequlize: Sequelize;

    beforeEach(async () => {
        sequlize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequlize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequlize.sync();
    });

    afterEach(async () => {
        await sequlize.close();
    });

    it("should generate an invoice", async () => {
        // Arrange
        const facade = InvoiceFacadeFactory.create();
        const input = {
            name: "Invoice 1",
            document: "12345678900",
            street: "Street 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345678",
            items: [
                { id: "c21b6ac0-ea14-4c19-b1e5-6d7165d62622", name: "Item 1", price: 100 },
                { id: "9586229a-cddf-4007-bf07-2de3b8b0370e", name: "Item 2", price: 200 },
            ],
        };

        // Act
        const result = await facade.generate(input);

        // Assert
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe(input.items[0].id);
        expect(result.items[0].name).toBe(input.items[0].name);
        expect(result.items[0].price).toBe(input.items[0].price);
        expect(result.items[1].id).toBe(input.items[1].id);
        expect(result.items[1].name).toBe(input.items[1].name);
        expect(result.items[1].price).toBe(input.items[1].price);
        expect(result.total).toBe(300);
    });

    it("should find an invoice", async () => {
        // Arrange
        const facade = InvoiceFacadeFactory.create();
        const input = {
            id: "6231acf6-0744-4f12-a14c-f00f584fef03",
            name: "Invoice 1",
            document: "12345678900",
            street: "Street 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345678",
            items: [
                { id: "c21b6ac0-ea14-4c19-b1e5-6d7165d62622", name: "Item 1", price: 100 },
                { id: "9586229a-cddf-4007-bf07-2de3b8b0370e", name: "Item 2", price: 200 },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const invoice = await InvoiceModel.create(input, { include: [{ model: InvoiceItemModel }] });

        // Act
        const resultFind = await facade.find({ id: invoice.id });
        
        // Assert
        expect(resultFind).toBeDefined();
        expect(resultFind.id).toBe(invoice.id);
        expect(resultFind.name).toBe(invoice.name);
        expect(resultFind.document).toBe(invoice.document);
        expect(resultFind.address.street).toBe(invoice.street);
        expect(resultFind.address.number).toBe(invoice.number);
        expect(resultFind.address.complement).toBe(invoice.complement);
        expect(resultFind.address.city).toBe(invoice.city);
        expect(resultFind.address.state).toBe(invoice.state);
        expect(resultFind.address.zipCode).toBe(invoice.zipCode);
        expect(resultFind.items.length).toBe(2);
        expect(resultFind.items[0].id).toBe(invoice.items[0].id);
        expect(resultFind.items[0].name).toBe(invoice.items[0].name);
        expect(resultFind.items[0].price).toBe(invoice.items[0].price);
        expect(resultFind.items[1].id).toBe(invoice.items[1].id);
        expect(resultFind.items[1].name).toBe(invoice.items[1].name);
        expect(resultFind.items[1].price).toBe(invoice.items[1].price);
        expect(resultFind.total).toBe(300);
    });

});
