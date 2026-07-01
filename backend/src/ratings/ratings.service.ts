import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { Store } from '../stores/entities/store.entity';
import { SubmitRatingDto } from './dto/submit-rating.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private ratingsRepo: Repository<Rating>,
    @InjectRepository(Store) private storesRepo: Repository<Store>,
    private notificationsService: NotificationsService,
  ) {}

  // Submit a new rating OR update an existing one for the same user+store
  async submit(userId: number, dto: SubmitRatingDto) {
    const store = await this.storesRepo.findOne({ where: { id: dto.storeId } });
    if (!store) throw new NotFoundException('Store not found');

    let rating = await this.ratingsRepo.findOne({
      where: { userId, storeId: dto.storeId },
    });

    const isUpdate = !!rating;

    if (rating) {
      rating.value = dto.value;
    } else {
      rating = this.ratingsRepo.create({ userId, storeId: dto.storeId, value: dto.value });
    }

    const saved = await this.ratingsRepo.save(rating);

    if (store.ownerId) {
      await this.notificationsService.create(
        store.ownerId,
        isUpdate ? NotificationType.RATING_UPDATED : NotificationType.NEW_RATING,
        `Your store "${store.name}" received a${isUpdate ? 'n updated' : ' new'} rating of ${dto.value}/5.`,
      );
    }

    return saved;
  }

  async myRatingForStore(userId: number, storeId: number) {
    return this.ratingsRepo.findOne({ where: { userId, storeId } });
  }

  async totalRatings(): Promise<number> {
    return this.ratingsRepo.count();
  }
}
