import express, { request, Request, Response } from 'express'
import ClientRepository from '../../repository/client.repository';
import AddClientUseCase from '../../usecase/add-client/add-client.usecase';
import { InputAddClientUseCaseDto, OutputAddClientUseCaseDto } from '../../usecase/add-client/add-client.usecase.dto';

export const clientAdmRouter = express.Router();
const clientRepository = new ClientRepository();

clientAdmRouter.post("/", async (request: Request, response: Response) => {
    const usecase = new AddClientUseCase(clientRepository);
    try {
        const clientDto = {
            name: request.body.name,
            email: request.body.email,
            document: request.body.document,
            street: request.body.street,
            number: request.body.number,
            complement: request.body.complement,
            city: request.body.city,
            state: request.body.state,
            zipCode: request.body.zipCode
        } as InputAddClientUseCaseDto;
        const output = await usecase.execute(clientDto) as OutputAddClientUseCaseDto;
        response.send(output);
    } catch (err) {
        response.status(500).send(err);
    }
});