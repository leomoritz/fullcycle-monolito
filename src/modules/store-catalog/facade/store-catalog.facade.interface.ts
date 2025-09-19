import { InputFindAllStoreCatalogFacadeDto, InputFindStoreCatalogFacadeDto, OutputFindAllStoreCatalogFacadeDto, OutputFindStoreCatalogFacadeDto } from "./store-catalog.facade.dto";

export default interface StoreCatalogFacadeInterface {
    find(id: InputFindStoreCatalogFacadeDto): Promise<OutputFindStoreCatalogFacadeDto>;
    findAll(input: InputFindAllStoreCatalogFacadeDto): Promise<OutputFindAllStoreCatalogFacadeDto>;
}