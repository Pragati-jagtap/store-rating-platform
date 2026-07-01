import { IsEmail, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsString()
  @MaxLength(400, { message: 'Address must be at most 400 characters' })
  address: string;

  // Optional: link an existing store-owner user as the owner of this store
  @IsOptional()
  @IsInt()
  ownerId?: number;
}
