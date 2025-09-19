export interface InputFindStoreCatalogFacadeDto {
    id: string;
}

export interface OutputFindStoreCatalogFacadeDto {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
}

export interface InputFindAllStoreCatalogFacadeDto {} // Necessário para caso futuramente seja trabalhado com paginações

export interface OutputFindAllStoreCatalogFacadeDto {
   products: {
     id: string;
    name: string;
    description: string;
    salesPrice: number;
   }[];
}