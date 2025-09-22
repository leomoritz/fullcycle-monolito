import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { InputGenerateInvoiceUseCaseDto } from "../usecase/generate-invoice/generate-invoice.dto";
import { InputGenerateInvoiceFacadeDto, OutputGenerateInvoiceFacadeDto, InputFindInvoiceFacadeDTO, OutputFindInvoiceFacadeDTO } from "./invoice.facade.dto";
import InvoiceFacadeInterface from "./invoice.facade.interface";

export type InvoiceFacadeProps = {
    generateUseCase: UseCaseInterface<InputGenerateInvoiceUseCaseDto, OutputGenerateInvoiceFacadeDto>;
    findUseCase: UseCaseInterface<InputFindInvoiceFacadeDTO, OutputFindInvoiceFacadeDTO>;
}

export class InvoiceFacade implements InvoiceFacadeInterface {
    private _generateUseCase: UseCaseInterface<InputGenerateInvoiceUseCaseDto, OutputGenerateInvoiceFacadeDto>;
    private _findUseCase: UseCaseInterface<InputFindInvoiceFacadeDTO, OutputFindInvoiceFacadeDTO>;
    
    constructor(props: InvoiceFacadeProps) {
        this._generateUseCase = props.generateUseCase;
        this._findUseCase = props.findUseCase;
    }


    async generate(input: InputGenerateInvoiceFacadeDto): Promise<OutputGenerateInvoiceFacadeDto> {
        return await this._generateUseCase.execute(input);
    }

    async find(input: InputFindInvoiceFacadeDTO): Promise<OutputFindInvoiceFacadeDTO> {
        return await this._findUseCase.execute(input);
    }
}