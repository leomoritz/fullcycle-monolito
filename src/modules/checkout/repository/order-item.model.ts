import { Column, ForeignKey, Model, PrimaryKey, Table, BelongsTo } from "sequelize-typescript";
import OrderModel from "./order.model";
import ProductModel from "../../store-catalog/repository/product.model";

@Table({
    tableName: "order_items",
    timestamps: false
})
export class OrderItemModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    orderId: string;

    @BelongsTo(() => OrderModel)
    order: OrderModel;

    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    productId: string;

    @BelongsTo(() => ProductModel)
    product: ProductModel;

    @Column({ allowNull: false })
    quantity: number;
}