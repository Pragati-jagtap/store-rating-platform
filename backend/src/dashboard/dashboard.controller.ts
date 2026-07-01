import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { StoresService } from '../stores/stores.service';
import { RatingsService } from '../ratings/ratings.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(
    private usersService: UsersService,
    private storesService: StoresService,
    private ratingsService: RatingsService,
  ) {}

  // Admin dashboard: total users, total stores, total ratings
  @Get('admin')
  @Roles(UserRole.ADMIN)
  async adminStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.usersService.getStats(),
      this.storesService.countStores(),
      this.ratingsService.totalRatings(),
    ]);
    return { totalUsers, totalStores, totalRatings };
  }
}
