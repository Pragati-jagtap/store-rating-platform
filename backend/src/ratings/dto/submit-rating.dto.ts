import { IsInt, Max, Min } from 'class-validator';

export class SubmitRatingDto {
  @IsInt()
  storeId: number;

  @IsInt()
  @Min(1, { message: 'Rating must be between 1 and 5' })
  @Max(5, { message: 'Rating must be between 1 and 5' })
  value: number;
}
