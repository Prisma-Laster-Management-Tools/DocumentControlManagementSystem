import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateCalibrationCycleDTO {
  @IsString()
  @IsNotEmpty()
  machine_name: string;

  @IsString()
  @IsNotEmpty()
  serial_number: string;

  @IsString()
  @IsNotEmpty()
  instruction: string;

  @IsDateString()
  @IsNotEmpty()
  cycle_start_at: Date;

  @IsString()
  @IsNotEmpty()
  cycle_info: string; // [fixed, cycle]
}
