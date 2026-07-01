import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IsStrongPassword } from '../../common/decorators/strong-password.decorator';

export class RegisterDto {
  @IsString()
  @MinLength(20, { message: 'Name must be at least 20 characters' })
  @MaxLength(60, { message: 'Name must be at most 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsString()
  @MaxLength(400, { message: 'Address must be at most 400 characters' })
  address: string;

  @IsStrongPassword()
  password: string;
}
