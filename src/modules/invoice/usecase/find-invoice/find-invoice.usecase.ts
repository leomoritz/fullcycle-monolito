import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { InputFindInvoiceUseCaseDTO, OutputFindInvoiceUseCaseDTO } from "./find-invoice.dto";

export class FindInvoiceUseCase implements UseCaseInterface<InputFindInvoiceUseCaseDTO, OutputFindInvoiceUseCaseDTO> {
    constructor(private _invoiceRepository: InvoiceGateway) { }

    async execute(input: InputFindInvoiceUseCaseDTO): Promise<OutputFindInvoiceUseCaseDTO> {
        const invoice = await this._invoiceRepository.find(input.id);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: {
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode
            },
            items: invoice.itemsList.map(item => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: invoice.total,
            createdAt: invoice.createdAt,
        };
    }
}