import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  // Normal user: submit a new rating or modify an existing one (1-5)
  @Post()
  @Roles(UserRole.USER)
  async submit(@CurrentUser() user: any, @Body() dto: SubmitRatingDto) {
    return this.ratingsService.submit(user.id, dto);
  }
}
