export interface InputFindAllProductsDto {}

export interface OutputFindAllProductsDto {
    products: {
        id: string;
        name: string;
        description: string;
        salesPrice: number;
    }[];
}