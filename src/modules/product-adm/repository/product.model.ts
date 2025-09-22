import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    modelName: "product-adm-table",
    tableName: "products",
    timestamps: false, // será controlado manualmente
})
export class ProductModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    description: string;

    @Column({ allowNull: true, field: "purchase_price" })
    purchasePrice: number;

    @Column({ allowNull: true })
    stock: number;

    @Column({ allowNull: false, field: "created_at" })
    createdAt: Date;

    @Column({ allowNull: false, field: "updated_at" })
    updatedAt: Date;
}