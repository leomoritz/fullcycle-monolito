import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    modelName: "product-catalog-table",
    tableName: "products",
    timestamps: false,
})
export default class ProductModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    description: string;

    @Column({ allowNull: true, field: "sales_price" })
    salesPrice: number;

    @Column({ allowNull: false, field: "created_at" })
    createdAt: Date;

    @Column({ allowNull: false, field: "updated_at" })
    updatedAt: Date;
}   