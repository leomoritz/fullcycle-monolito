import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
    tableName: 'invoice_items',
    timestamps: false,
})
export class InvoiceItemModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    price: number;

    @Column({ allowNull: false, field: 'invoice_id' })
    @ForeignKey(() => InvoiceModel)
    invoiceId: string;
}