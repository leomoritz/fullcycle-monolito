export interface InputProcessPaymentDto {
    orderId: string;
    amount: number;
}

export interface OutputProcessPaymentDto {
    transactionId: string;
    orderId: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}