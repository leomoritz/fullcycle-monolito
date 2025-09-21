import InvoiceItem, { InvoiceItemId } from "../../domain/entity/invoice-item.entity";
import Invoice, { InvoiceId } from "../../domain/entity/invoice.entity";
import Address from "../../domain/value-object/address.value-object";
import { InputGenerateInvoiceUseCaseDto } from "./generate-invoice.dto";
import { GenerateInvoiceUseCase } from "./generate-invoice.usecase";

const itemOne = {
    name: "Product 1",
    price: 100,
};

const itemTwo = {
    name: "Product 2",
    price: 200,
};
const invoiceInput = {
    name: "Invoice 1",
    document: "123456789",
    street: "123 Main St",
    number: "456",
    complement: "Apt 789",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    items: [itemOne, itemTwo],
} as InputGenerateInvoiceUseCaseDto;

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

const MockRepository = () => {
    return {
        generate: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        find: jest.fn(),
    };
};

describe("Generate Invoice Use Case", () => {
    it("should generate a invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(invoiceRepository);

        const result = await usecase.execute(invoiceInput);

        expect(result).toBeDefined();
        expect(result.id).toBe(invoice.id.id);
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.street).toBe(invoice.address.street);
        expect(result.number).toBe(invoice.address.number);
        expect(result.complement).toBe(invoice.address.complement);
        expect(result.city).toBe(invoice.address.city);
        expect(result.state).toBe(invoice.address.state);
        expect(result.zipCode).toBe(invoice.address.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe(invoice.itemsList[0].id.id);
        expect(result.items[0].name).toBe(invoice.itemsList[0].name);
        expect(result.items[0].price).toBe(invoice.itemsList[0].price);
        expect(result.items[1].id).toBe(invoice.itemsList[1].id.id);
        expect(result.items[1].name).toBe(invoice.itemsList[1].name);
        expect(result.items[1].price).toBe(invoice.itemsList[1].price);
        expect(result.total).toBe(300);
    });
});

