import { IsOptional, IsString, IsIn, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class QueryUsersDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsIn(['name', 'email', 'address', 'role', 'createdAt'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
