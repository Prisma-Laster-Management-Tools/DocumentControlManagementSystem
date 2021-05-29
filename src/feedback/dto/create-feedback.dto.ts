import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString } from 'class-validator';

export class CreateFeedbackDTO {
  @IsNotEmpty()
  feedback_str: string;

  @IsNotEmpty()
  quality_rating_score: number;

  @IsNotEmpty()
  worthiness_rating_score: number;
  @IsNotEmpty()
  delivery_rating_score: number;
  @IsNotEmpty()
  service_rating_score: number;
  @IsNotEmpty()
  access_token: string;
}
