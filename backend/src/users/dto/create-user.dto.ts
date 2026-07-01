import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { IsStrongPassword } from '../../common/decorators/strong-password.decorator';

export class CreateUserDto {
  @IsString()
  @MinLength(20, { message: 'Name must be at least 20 characters' })
  @MaxLength(60, { message: 'Name must be at most 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  @MaxLength(400, { message: 'Address must be at most 400 characters' })
  address: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
