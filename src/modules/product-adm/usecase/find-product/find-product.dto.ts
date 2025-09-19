export interface InputFindProductDto {
    id: string;
}

export interface OutputFindProductDto {
    id: string;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}