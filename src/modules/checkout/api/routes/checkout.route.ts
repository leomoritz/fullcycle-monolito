import express, { Request, Response } from 'express'
import PlaceOrderUseCaseFactory from '../../factory/place-order.usecase.factory';
import { InputPlaceOrderDto, OutputPlaceOrderDto } from '../../usecase/place-order/place-order.dto';

export const checkoutRouter = express.Router();

checkoutRouter.post("/", async (request: Request, response: Response) => {
    const usecase = PlaceOrderUseCaseFactory.create();

    try {
        const orderDto = {
            clientId: request.body.clientId,
            products: request.body.products
        } as InputPlaceOrderDto;
        const output = await usecase.execute(orderDto) as OutputPlaceOrderDto;
        response.send(output);
    } catch (err) {
        response.status(500).send(err);
    }
});