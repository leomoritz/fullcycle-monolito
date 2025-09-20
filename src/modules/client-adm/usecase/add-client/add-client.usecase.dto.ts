export interface InputAddClientUseCaseDto {
  id?: string;
  name: string;
  email: string;
  address: string;
}

export interface OutputAddClientUseCaseDto {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}