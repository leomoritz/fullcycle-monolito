import InvoiceItem, { InvoiceItemId } from "../../domain/entity/invoice-item.entity";
import Invoice, { InvoiceId } from "../../domain/entity/invoice.entity";
import Address from "../../domain/value-object/address.value-object";
import { FindInvoiceUseCase } from "./find-invoice.usecase";

const address = new Address({
    street: "Street 1",
    number: "123",
    complement: "Apt 1",
    city: "City 1",
    state: "State 1",
    zipCode: "12345-678"
});

const invoiceItemOne = new InvoiceItem({
    id: new InvoiceItemId("c81185d1-ad50-414a-8c84-cc8afcb35710"),
    name: "Item 1",
    price: 100
});

const invoiceItemTwo = new InvoiceItem({
    id: new InvoiceItemId("97f2ce3f-a766-48bc-bb7c-d8f392ce3ccd"),
    name: "Item 2",
    price: 200
});

const invoice = new Invoice({
    id: new InvoiceId("248649f9-055b-46c3-acf7-d6b0f3fcbf58"),
    name: "Invoice 1",
    document: "12345678900",
    address: address,
    items: [invoiceItemOne, invoiceItemTwo]
});

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        generate: jest.fn()
    };
};

describe("Find Invoice Use Case", () => {
    it("should find a invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new FindInvoiceUseCase(invoiceRepository);

        const input = {
            id: "248649f9-055b-46c3-acf7-d6b0f3fcbf58"
        };

        const result = await usecase.execute(input);

        expect(result).toBeDefined();
        expect(result.id).toBe(input.id);
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.address.street).toBe(address.street);
        expect(result.address.number).toBe(address.number);
        expect(result.address.complement).toBe(address.complement);
        expect(result.address.city).toBe(address.city);
        expect(result.address.state).toBe(address.state);
        expect(result.address.zipCode).toBe(address.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe(invoiceItemOne.id.id);
        expect(result.items[0].name).toBe(invoiceItemOne.name);
        expect(result.items[0].price).toBe(invoiceItemOne.price);
        expect(result.items[1].id).toBe(invoiceItemTwo.id.id);
        expect(result.items[1].name).toBe(invoiceItemTwo.name);
        expect(result.items[1].price).toBe(invoiceItemTwo.price);
        expect(result.total).toBe(300);
        expect(result.createdAt).toEqual(invoice.createdAt);
    });
});