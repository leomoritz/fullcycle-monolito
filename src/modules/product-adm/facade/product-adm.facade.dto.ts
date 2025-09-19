export interface InputAddProductFacadeDto {
    id?: string;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
}

export interface InputFindProductFacadeDto {
    id: string;
}

export interface OutputFindProductFacadeDto {
    id: string;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}