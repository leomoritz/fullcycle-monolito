import express, { Request, Response } from 'express'
import ProductRepository from '../../repository/product.repository';
import AddProductUseCase from '../../usecase/add-product/add-product.usecase';
import { InputAddProductDto, OutputAddProductDto } from '../../usecase/add-product/add-product.dto';

export const productAdmRouter = express.Router();
const productRepository = new ProductRepository();

productAdmRouter.post("/", async (request: Request, response: Response) => {
    const usecase = new AddProductUseCase(productRepository);
    try {
        const productDto = {
            name: request.body.name,
            description: request.body.description,
            purchasePrice: request.body.purchasePrice,
            salesPrice: request.body.salesPrice,
            stock: request.body.stock
        } as InputAddProductDto;
        const output = await usecase.execute(productDto) as OutputAddProductDto;
        response.send(output);
    } catch (err) {
        response.status(500).send(err);
    }
});