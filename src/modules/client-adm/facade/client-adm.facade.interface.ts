import { InputAddClientFacadeDto, InputFindClientFacadeDto, OutputFindClientFacadeDto } from "./client-adm.facade.dto";

export default interface ClientAdmFacadeInterface {
  add(input: InputAddClientFacadeDto): Promise<void>;
  find(input: InputFindClientFacadeDto): Promise<OutputFindClientFacadeDto>;
}