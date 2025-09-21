import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import { InvoiceItemModel } from "./invoice-item.model";
import InvoiceRepository from "./invoice.repository";
import Invoice, { InvoiceId } from "../domain/entity/invoice.entity";
import Address from "../domain/value-object/address.value-object";
import InvoiceItem, { InvoiceItemId } from "../domain/entity/invoice-item.entity";

const invoice = new Invoice({
    id: new InvoiceId("248649f9-055b-46c3-acf7-d6b0f3fcbf58"),
    name: "Invoice 1",
    document: "123456789",
    address: new Address({
        street: "123 Main St",
        number: "456",
        complement: "Apt 789",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
    }),
    items: [
        new InvoiceItem({
            id: new InvoiceItemId("c81185d1-ad50-414a-8c84-cc8afcb35710"),
            name: "Product 1",
            price: 100
        }),
        new InvoiceItem({
            id: new InvoiceItemId("97f2ce3f-a766-48bc-bb7c-d8f392ce3ccd"),
            name: "Product 2",
            price: 200
        })
    ]
});

describe("InvoiceRepository test", () => {
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

    it("should generate a invoice", async () => {
        // Arrange
        const invoiceRepository = new InvoiceRepository();

        // Act
        const invoiceGenerated = await invoiceRepository.generate(invoice);

        // Assert
        expect(invoiceGenerated).toBeDefined();
        expect(invoiceGenerated.id.id).toBe(invoice.id.id);
        expect(invoiceGenerated.name).toBe(invoice.name);
        expect(invoiceGenerated.document).toBe(invoice.document);
        expect(invoiceGenerated.address.street).toBe(invoice.address.street);
        expect(invoiceGenerated.address.number).toBe(invoice.address.number);
        expect(invoiceGenerated.address.complement).toBe(invoice.address.complement);
        expect(invoiceGenerated.address.city).toBe(invoice.address.city);
        expect(invoiceGenerated.address.state).toBe(invoice.address.state);
        expect(invoiceGenerated.address.zipCode).toBe(invoice.address.zipCode);
        expect(invoiceGenerated.itemsList.length).toBe(2);
        expect(invoiceGenerated.itemsList[0].id.id).toBe(invoice.itemsList[0].id.id);
        expect(invoiceGenerated.itemsList[0].name).toBe(invoice.itemsList[0].name);
        expect(invoiceGenerated.itemsList[0].price).toBe(invoice.itemsList[0].price);
        expect(invoiceGenerated.itemsList[1].id.id).toBe(invoice.itemsList[1].id.id);
        expect(invoiceGenerated.itemsList[1].name).toBe(invoice.itemsList[1].name);
        expect(invoiceGenerated.itemsList[1].price).toBe(invoice.itemsList[1].price);
    });

    it("should find a invoice", async () => {
        // Arrange
        const invoiceRepository = new InvoiceRepository();
        await invoiceRepository.generate(invoice);

        // Act
        const invoiceFound = await invoiceRepository.find(invoice.id.id);

        // Assert
        expect(invoiceFound).toBeDefined();
        expect(invoiceFound.id.id).toBe(invoice.id.id);
        expect(invoiceFound.name).toBe(invoice.name);
        expect(invoiceFound.document).toBe(invoice.document);
        expect(invoiceFound.address.street).toBe(invoice.address.street);
        expect(invoiceFound.address.number).toBe(invoice.address.number);
        expect(invoiceFound.address.complement).toBe(invoice.address.complement);
        expect(invoiceFound.address.city).toBe(invoice.address.city);
        expect(invoiceFound.address.state).toBe(invoice.address.state);
        expect(invoiceFound.address.zipCode).toBe(invoice.address.zipCode);
        expect(invoiceFound.itemsList.length).toBe(2);
        expect(invoiceFound.itemsList[0].id.id).toBe(invoice.itemsList[0].id.id);
        expect(invoiceFound.itemsList[0].name).toBe(invoice.itemsList[0].name);
        expect(invoiceFound.itemsList[0].price).toBe(invoice.itemsList[0].price);
        expect(invoiceFound.itemsList[1].id.id).toBe(invoice.itemsList[1].id.id);
        expect(invoiceFound.itemsList[1].name).toBe(invoice.itemsList[1].name);
        expect(invoiceFound.itemsList[1].price).toBe(invoice.itemsList[1].price);
    });

    it("should throw an error when invoice is not found", async () => {
        // Arrange
        const invoiceRepository = new InvoiceRepository();

        // Act & Assert
        await expect(invoiceRepository.find("2b4b41f4-78ed-4926-ae07-73c5988ee542")) //
        .rejects.toThrow("Invoice not found");
    });

});