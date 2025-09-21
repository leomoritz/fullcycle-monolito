import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceItem, { InvoiceItemId } from "../../domain/entity/invoice-item.entity";
import Invoice from "../../domain/entity/invoice.entity";
import Address from "../../domain/value-object/address.value-object";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { InputGenerateInvoiceUseCaseDto, OutputGenerateInvoiceUseCaseDto } from "./generate-invoice.dto";

export class GenerateInvoiceUseCase implements UseCaseInterface<InputGenerateInvoiceUseCaseDto, OutputGenerateInvoiceUseCaseDto> {
    constructor(private _invoiceRepository: InvoiceGateway) { }

    async execute(input: InputGenerateInvoiceUseCaseDto): Promise<OutputGenerateInvoiceUseCaseDto> {
        const address = new Address({
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode
        });

        const invoice = new Invoice({
            name: input.name,
            document: input.document,
            address: address
        });

        input.items.forEach(item => {
            invoice.addItem(new InvoiceItem({
                id: new InvoiceItemId(item.id),
                name: item.name,
                price: item.price
            }));
        });

        const invoiceGenerated = await this._invoiceRepository.generate(invoice);

        return {
            id: invoiceGenerated.id.id,
            name: invoiceGenerated.name,
            document: invoiceGenerated.document,
            street: invoiceGenerated.address.street,
            number: invoiceGenerated.address.number,
            complement: invoiceGenerated.address.complement,
            city: invoiceGenerated.address.city,
            state: invoiceGenerated.address.state,
            zipCode: invoiceGenerated.address.zipCode,
            items: invoiceGenerated.itemsList.map(item => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: invoiceGenerated.total,
        };
    }
}