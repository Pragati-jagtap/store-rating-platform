import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Normal user self-registration
  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto as any, UserRole.USER);
    return this.buildAuthResponse(user.id, user.email, user.role, user.name);
  }

  // Single login system for all roles
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    return this.buildAuthResponse(user.id, user.email, user.role, user.name);
  }

  // Security/Settings: change password for any logged-in user
  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('Current password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updatePassword(userId, hashed);
    return { success: true, message: 'Password updated successfully' };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    const { password, ...rest } = user;
    return rest;
  }

  private buildAuthResponse(id: number, email: string, role: UserRole, name: string) {
    const payload = { sub: id, email, role, name };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id, email, role, name },
    };
  }
}
