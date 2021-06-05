import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsOptional } from 'class-validator';

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
}
