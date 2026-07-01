import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { QueryStoresDto } from './dto/query-stores.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private storesRepo: Repository<Store>,
    @InjectRepository(Rating) private ratingsRepo: Repository<Rating>,
  ) {}

  // Admin: add a new store
  async create(dto: CreateStoreDto): Promise<Store> {
    const existing = await this.storesRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('A store with this email already exists');

    const store = this.storesRepo.create(dto);
    return this.storesRepo.save(store);
  }

  async findById(id: number): Promise<Store> {
    const store = await this.storesRepo.findOne({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  // List stores (used by Admin listing & Normal user browsing) with search + sort
  // Also includes overall rating and (if userId provided) the current user's submitted rating
  async findAll(query: QueryStoresDto, userId?: number) {
    const qb = this.storesRepo
      .createQueryBuilder('store')
      .leftJoin('store.ratings', 'rating')
      .select([
        'store.id AS id',
        'store.name AS name',
        'store.email AS email',
        'store.address AS address',
      ])
      .addSelect('AVG(rating.value)', 'overallRating')
      .addSelect('COUNT(rating.id)', 'ratingCount')
      .groupBy('store.id');

    if (query.name) qb.andWhere('store.name LIKE :name', { name: `%${query.name}%` });
    if (query.address) qb.andWhere('store.address LIKE :address', { address: `%${query.address}%` });
    if (query.email) qb.andWhere('store.email LIKE :email', { email: `%${query.email}%` });

    const sortBy = query.sortBy && query.sortBy !== 'rating' ? `store.${query.sortBy}` : 'overallRating';
    const sortOrder = query.sortOrder || 'ASC';
    qb.orderBy(sortBy, sortOrder);

    const rawStores = await qb.getRawMany();

    let myRatingsMap = new Map<number, number>();
    if (userId) {
      const myRatings = await this.ratingsRepo.find({ where: { userId } });
      myRatingsMap = new Map(myRatings.map((r) => [r.storeId, r.value]));
    }

    return rawStores.map((s) => ({
      id: Number(s.id),
      name: s.name,
      email: s.email,
      address: s.address,
      overallRating: s.overallRating ? parseFloat(parseFloat(s.overallRating).toFixed(2)) : null,
      ratingCount: Number(s.ratingCount),
      myRating: userId ? myRatingsMap.get(Number(s.id)) || null : undefined,
    }));
  }

  async getStoreDetail(id: number) {
    const store = await this.findById(id);
    const result = await this.ratingsRepo
      .createQueryBuilder('rating')
      .where('rating.storeId = :id', { id })
      .select('AVG(rating.value)', 'avg')
      .addSelect('COUNT(rating.id)', 'count')
      .getRawOne();

    return {
      ...store,
      overallRating: result?.avg ? parseFloat(parseFloat(result.avg).toFixed(2)) : null,
      ratingCount: Number(result?.count || 0),
    };
  }

  // Store owner dashboard: list users who rated their store + average rating
  async getOwnerDashboard(ownerId: number) {
    const stores = await this.storesRepo.find({ where: { ownerId } });
    const storeIds = stores.map((s) => s.id);
    if (storeIds.length === 0) {
      return { stores: [], raters: [], averageRating: null };
    }

    const raters = await this.ratingsRepo
      .createQueryBuilder('rating')
      .innerJoinAndSelect('rating.user', 'user')
      .innerJoinAndSelect('rating.store', 'store')
      .where('rating.storeId IN (:...storeIds)', { storeIds })
      .orderBy('rating.createdAt', 'DESC')
      .getMany();

    const avgResult = await this.ratingsRepo
      .createQueryBuilder('rating')
      .where('rating.storeId IN (:...storeIds)', { storeIds })
      .select('AVG(rating.value)', 'avg')
      .getRawOne();

    return {
      stores,
      raters: raters.map((r) => ({
        ratingId: r.id,
        value: r.value,
        storeName: r.store.name,
        userName: r.user.name,
        userEmail: r.user.email,
        ratedAt: r.createdAt,
      })),
      averageRating: avgResult?.avg ? parseFloat(parseFloat(avgResult.avg).toFixed(2)) : null,
    };
  }

  async countStores(): Promise<number> {
    return this.storesRepo.count();
  }
}
