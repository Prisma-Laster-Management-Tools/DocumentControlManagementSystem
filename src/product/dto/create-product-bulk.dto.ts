import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class CreateProductBulkDTO {
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  importation_datas: Array<any>;
}
