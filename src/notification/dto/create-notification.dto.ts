import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsDate,
  IsDateString,
  IsString,
  ValidateIf,
  IsOptional,
} from 'class-validator';

export class CreateNotificationDTO {
  //@IsNotEmpty() // default would be null instead
  @IsString()
  @ValidateIf((object, value) => value !== null) // Only do the above validation if the passed value is not null
  related_positions: string | null;

  @IsString()
  @IsOptional()
  message: string = 'no message attached'; // default value

  attached_params: string;
}
