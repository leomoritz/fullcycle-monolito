export interface InputFindClientUseCaseDto {
    id: string;
}

export interface OutputFindClientUseCaseDto {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}