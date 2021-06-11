import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsOptional } from 'class-validator';

export class QueryGetBaseProductDTO {
  // @Type(() => Number) // cast string of def behavior of query value to number
  // @IsNumber()
  // @IsOptional()
  // page: number;

  // @Type(() => Number) // cast string of def behavior of query value to number
  // @IsNumber()
  // @IsOptional()
  // limit: number;

  @IsOptional()
  with_protocol: boolean;
}
