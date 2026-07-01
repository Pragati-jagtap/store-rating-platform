import { Controller, Get, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  // Any logged-in user (Admin, Normal User, Store Owner) sees their own notifications
  @Get()
  findMine(@CurrentUser() user: any) {
    return this.notificationsService.findForUser(user.id);
  }

  @Get('unread-count')
  unreadCount(@CurrentUser() user: any) {
    return this.notificationsService.unreadCount(user.id);
  }

  @Patch(':id/read')
  markAsRead(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(user.id, id);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.id);
  }
}
