import express, { Request, Response } from 'express'
import InvoiceRepository from '../../repository/invoice.repository';
import { FindInvoiceUseCase } from '../../usecase/find-invoice/find-invoice.usecase';
import { InputFindInvoiceUseCaseDTO, OutputFindInvoiceUseCaseDTO } from '../../usecase/find-invoice/find-invoice.dto';

export const invoiceRouter = express.Router();
const invoiceRepository = new InvoiceRepository();

invoiceRouter.get("/:id", async (request: Request, response: Response) => {
    const usecase = new FindInvoiceUseCase(invoiceRepository);
    try {
        const invoiceDto = {
            id: request.params.id
        } as InputFindInvoiceUseCaseDTO;
        const output = await usecase.execute(invoiceDto) as OutputFindInvoiceUseCaseDTO;
        response.send(output);
    } catch (err) {
        console.log(err);
        response.status(500).send(err);
    }
});