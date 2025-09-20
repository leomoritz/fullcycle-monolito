import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type TransactionProps = {
    id?: TransactionId;
    amount: number;
    orderId: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
};

// Value Object for TransactionId to ensure type safety and encapsulation of the ID logic specific to transactions domain.
export class TransactionId extends Id {
    constructor(id?: string) {
        super(id);
    }
}

export default class Transaction extends BaseEntity implements AggregateRoot {
    private _amount: number;
    private _orderId: string;
    private _status: string;

    constructor(props: TransactionProps) {
        super(props.id);
        this._amount = props.amount;
        this._orderId = props.orderId;
        this._status = props.status || "pending";
    }

    validate(): void {
        if (this._amount <= 0) {
            throw new Error("Amount must be greater than zero");
        }
    }

    approve(): void {
        this._status = "approved";
    }

    decline(): void {
        this._status = "declined";
    }

    process(): void {
        if (this._amount >= 100) {
            this.approve();
        } else {
            this.decline();
        }
    }

    get amount(): number {
        return this._amount;
    }

    get orderId(): string {
        return this._orderId;
    }

    get status(): string {
        return this._status;
    }

}