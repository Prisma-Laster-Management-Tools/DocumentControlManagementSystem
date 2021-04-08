import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @Type(() => Number) // cast string of def behavior of query value to number
  @IsNumber()
  @IsOptional()
  page: number;

  @Type(() => Number) // cast string of def behavior of query value to number
  @IsNumber()
  @IsOptional()
  limit: number;
}

export interface PaginateResult {
  data: any[];
  page: number;
  limit: number;
  totalCount: number;
  totalPage: number;
}
