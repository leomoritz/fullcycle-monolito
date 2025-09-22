import Id from "../../@shared/domain/value-object/id.value-object";
import { ClientModel } from "../../client-adm/repository/client.model";
import ProductModel from "../../store-catalog/repository/product.model";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderItemModel } from "./order-item.model";
import OrderModel from "./order.model";

export class OrderRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        await OrderModel.create({
            id: order.id.id,
            clientId: order.client.id.id,
            items: order.products.map(item => ({
                id: item.id.id,
                productId: item.id.id,
                quantity: item.quantity,
            })),
        }, {
            include: [OrderItemModel]
        });
    }
    
    async findOrder(id: string): Promise<Order | null> {
        const order = await OrderModel.findOne({
            where: { id },
            include: [
                { model: OrderItemModel, include: [ProductModel] },
                ClientModel
            ]
        });

        if (!order) {
            throw new Error("Order not found");
        }

        return new Order({
            id: new Id(order.id),
            client: new Client({
                id: new Id(order.client.id),
                name: order.client.name,
                email: order.client.email,
                document: order.client.document,
                street: order.client.street,
                number: order.client.number,
                complement: order.client.complement,
                city: order.client.city,
                state: order.client.state,
                zipCode: order.client.zipCode
            }),
            products: order.items.map(item => new Product({
                id: new Id(item.productId),
                name: item.product?.name,
                description: item.product?.description,
                salesPrice: item.product?.salesPrice,
                quantity: item.quantity,
            }))
        });
    }
}