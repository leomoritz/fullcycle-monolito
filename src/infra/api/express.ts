import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel as ProductAdmModel } from "../../modules/product-adm/repository/product.model";
import { productAdmRouter } from "../../modules/product-adm/api/routes/product-adm.route";
import { clientAdmRouter } from "../../modules/client-adm/api/routes/client-adm.route";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { invoiceRouter } from "../../modules/invoice/api/routes/invoice.route";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import { checkoutRouter } from "../../modules/checkout/api/routes/checkout.route";
import OrderModel from "../../modules/checkout/repository/order.model";
import { OrderItemModel } from "../../modules/checkout/repository/order-item.model";
import ProductModel from "../../modules/store-catalog/repository/product.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";

export const app: Express = express();
app.use(express.json())
app.use("/products", productAdmRouter)
app.use("/clients", clientAdmRouter)
app.use("/invoices", invoiceRouter)
app.use("/checkouts", checkoutRouter)

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
    });
    await sequelize.addModels([
        OrderModel,
        OrderItemModel,
        ClientModel,
        ProductModel,
        ProductAdmModel,
        InvoiceModel,
        InvoiceItemModel,
        TransactionModel
    ]);
    await sequelize.sync();
}

setupDb();