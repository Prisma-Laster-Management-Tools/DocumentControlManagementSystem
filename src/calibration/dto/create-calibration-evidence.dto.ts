import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCalibrationEvidenceDTO {
  @IsString()
  @IsNotEmpty()
  machine_name: string;

  @IsString()
  @IsNotEmpty()
  serial_number: string;

  @IsString()
  @IsOptional()
  description: string;

  @Type(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  is_pass: boolean;
}
