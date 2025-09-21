import Invoice from "../domain/entity/invoice.entity";

export default interface InvoiceGateway {
    generate(invoice: Invoice): Promise<Invoice>;
    find(invoiceId: string): Promise<Invoice>;
}