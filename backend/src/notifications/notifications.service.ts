import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notifRepo: Repository<Notification>,
  ) {}

  async create(userId: number, type: NotificationType, message: string) {
    const notif = this.notifRepo.create({ userId, type, message });
    return this.notifRepo.save(notif);
  }

  async findForUser(userId: number) {
    return this.notifRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(userId: number, id: number) {
    await this.notifRepo.update({ id, userId }, { isRead: true });
    return { success: true };
  }

  async markAllAsRead(userId: number) {
    await this.notifRepo.update({ userId, isRead: false }, { isRead: true });
    return { success: true };
  }

  async unreadCount(userId: number) {
    const count = await this.notifRepo.count({ where: { userId, isRead: false } });
    return { count };
  }
}
