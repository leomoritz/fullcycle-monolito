import { InputFindInvoiceFacadeDTO, InputGenerateInvoiceFacadeDto, OutputFindInvoiceFacadeDTO, OutputGenerateInvoiceFacadeDto } from "./invoice.facade.dto";

export default interface InvoiceFacadeInterface {
    generate(input: InputGenerateInvoiceFacadeDto): Promise<OutputGenerateInvoiceFacadeDto>;
    find(input: InputFindInvoiceFacadeDTO): Promise<OutputFindInvoiceFacadeDTO>;
}