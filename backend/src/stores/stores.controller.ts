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
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { QueryStoresDto } from './dto/query-stores.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoresController {
  constructor(
    private storesService: StoresService,
    private notificationsService: NotificationsService,
  ) {}

  // Admin: Add new store
  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateStoreDto) {
    const store = await this.storesService.create(dto);
    if (store.ownerId) {
      await this.notificationsService.create(
        store.ownerId,
        NotificationType.STORE_ADDED,
        `A new store "${store.name}" has been registered under your account.`,
      );
    }
    return store;
  }

  // Admin + Normal User: browse / search / sort stores
  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  async findAll(@Query() query: QueryStoresDto, @CurrentUser() user: any) {
    const userId = user.role === UserRole.USER ? user.id : undefined;
    return this.storesService.findAll(query, userId);
  }

  // Store owner dashboard: raters list + average rating
  @Get('owner/dashboard')
  @Roles(UserRole.STORE_OWNER)
  async ownerDashboard(@CurrentUser() user: any) {
    return this.storesService.getOwnerDashboard(user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storesService.getStoreDetail(id);
  }
}
