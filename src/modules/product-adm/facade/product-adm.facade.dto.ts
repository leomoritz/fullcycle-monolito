export interface InputAddProductFacadeDto {
    id?: string;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
}

export interface InputCheckStockFacadeDto {
    productId: string;
}

export interface OutputCheckStockFacadeDto {
    productId: string;
    stock: number;
}