import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  // Admin: add new normal users or admin users
  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto, dto.role);
    await this.notificationsService.create(
      user.id,
      NotificationType.ACCOUNT_CREATED,
      'Your account has been created by an administrator.',
    );
    const { password, ...rest } = user;
    return rest;
  }

  // Admin: list users with filters (name, email, address, role) + sorting
  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query() query: QueryUsersDto) {
    const users = await this.usersService.findAll(query);
    return users.map(({ password, ...rest }) => rest);
  }

  // Admin: view full detail of a user (includes rating if store owner)
  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserDetail(id);
  }
}
