import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsNumber, IsBoolean, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';

class QcBulkSingularObject {
  @IsNumber()
  @IsNotEmpty()
  protocol_id: number;

  @IsBoolean()
  @IsNotEmpty()
  check_status: number;
}

export class CreateControlProcessBulkDTO {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  //   If you want to use this -> @NOTE-TO-MYSELF -> I will have to modify the exception filter also
  //   @IsArray()
  //   @ValidateNested({ each: true })
  //   @ArrayMinSize(1)
  //   @IsNotEmpty()
  //   @Type(() => QcBulkSingularObject)
  //   qc_datas: QcBulkSingularObject[];
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  qc_datas: Array<any>;
}
