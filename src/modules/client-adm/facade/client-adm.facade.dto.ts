export interface InputAddClientFacadeDto {
  id?: string;
  name: string;
  email: string;
  address: string;
}

export interface InputFindClientFacadeDto {
    id: string;
}

export interface OutputFindClientFacadeDto {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}