import InvoiceItem, { InvoiceItemId } from "../domain/entity/invoice-item.entity";
import Invoice, { InvoiceId } from "../domain/entity/invoice.entity";
import Address from "../domain/value-object/address.value-object";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    async generate(invoice: Invoice): Promise<Invoice> {
        const invoiceGenerated = await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.itemsList.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        }, {
            include: [{ model: InvoiceItemModel }],
        });

        return new Invoice({
            id: new InvoiceId(invoiceGenerated.id),
            name: invoiceGenerated.name,
            document: invoiceGenerated.document,
            address: new Address({
                street: invoiceGenerated.street,
                number: invoiceGenerated.number,
                complement: invoiceGenerated.complement,
                city: invoiceGenerated.city,
                state: invoiceGenerated.state,
                zipCode: invoiceGenerated.zipCode,
            }),
            items: invoiceGenerated.items.map((item) => new InvoiceItem({
                id: new InvoiceItemId(item.id),
                name: item.name,
                price: item.price,
            })),
            createdAt: invoiceGenerated.createdAt,
            updatedAt: invoiceGenerated.updatedAt,
        });
    }
    
    async find(invoiceId: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: { id: invoiceId },
            include: [{ model: InvoiceItemModel }],
        });

        if (!invoice) {
            throw new Error("Invoice not found");
        }

        return new Invoice({
            id: new InvoiceId(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address({
                street: invoice.street,
                number: invoice.number,
                complement: invoice.complement,
                city: invoice.city,
                state: invoice.state,
                zipCode: invoice.zipCode,
            }),
            items: invoice.items.map((item) => new InvoiceItem({
                id: new InvoiceItemId(item.id),
                name: item.name,
                price: item.price,
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        });
    }
}