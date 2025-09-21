import AggregateRoot from "../../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../../@shared/domain/entity/base.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/address.value-object";
import InvoiceItem from "./invoice-item.entity";

export type InvoiceProps = {
    id?: InvoiceId
    name: string;
    document: string;
    address: Address; // value object
    items?: InvoiceItem[]; // entity
    createdAt?: Date;
    updatedAt?: Date;
}

export class InvoiceId extends Id {
    constructor(id?: string) {
        super(id);
    }
}

export default class Invoice extends BaseEntity implements AggregateRoot {
    private _name: string;
    private _document: string
    private _address: Address;
    private items: InvoiceItem[];
    
    constructor(props: InvoiceProps) {
        super(props.id, props.createdAt, props.updatedAt);
        this._name = props.name;
        this._document = props.document;
        this._address = props.address;
        this.items = props.items || [];
    }

    get name(): string {
        return this._name;
    }
    
    get document(): string {
        return this._document;
    }

    get address(): Address {
        return this._address;
    }
    
    get itemsList(): InvoiceItem[] {
        return this.items;
    }

    get total(): number {
        return this.items.reduce((acc, item) => acc + item.price, 0);
    }

    addItem(item: InvoiceItem): void {
        this.items.push(item);
    }
}