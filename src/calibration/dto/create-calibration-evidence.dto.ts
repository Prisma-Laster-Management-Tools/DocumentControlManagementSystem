import { Transform, Type } from 'class-transformer';
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

  //@Type(() => Boolean) // does not work
  @IsBoolean()
  @Transform((boolean_as_str) => {
    if (boolean_as_str.value === 'true') {
      return true;
    }
    return false;
  })
  @IsNotEmpty()
  is_pass: boolean;
}
