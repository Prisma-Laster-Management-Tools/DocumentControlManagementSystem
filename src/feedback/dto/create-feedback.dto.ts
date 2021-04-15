import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsDate,
  IsDateString,
} from 'class-validator';

export class CreateFeedbackDTO {
  @IsNotEmpty()
  feedback_str: string;
}
