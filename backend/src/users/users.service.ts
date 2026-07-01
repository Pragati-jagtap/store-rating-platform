import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { Rating } from '../ratings/entities/rating.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Rating) private ratingsRepo: Repository<Rating>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto, role?: UserRole): Promise<User> {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      ...dto,
      password: hashed,
      role: role || dto.role || UserRole.USER,
    });
    return this.usersRepo.save(user);
  }

  async findAll(query: QueryUsersDto): Promise<User[]> {
    const qb = this.usersRepo.createQueryBuilder('user');

    if (query.name) qb.andWhere('user.name LIKE :name', { name: `%${query.name}%` });
    if (query.email) qb.andWhere('user.email LIKE :email', { email: `%${query.email}%` });
    if (query.address) qb.andWhere('user.address LIKE :address', { address: `%${query.address}%` });
    if (query.role) qb.andWhere('user.role = :role', { role: query.role });

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'DESC';
    qb.orderBy(`user.${sortBy}`, sortOrder);

    return qb.getMany();
  }

  async getUserDetail(id: number) {
    const user = await this.findById(id);
    let avgRating: number | null = null;

    if (user.role === UserRole.STORE_OWNER) {
      // average rating across stores owned by this user
      const result = await this.ratingsRepo
        .createQueryBuilder('rating')
        .innerJoin('rating.store', 'store')
        .where('store.ownerId = :ownerId', { ownerId: id })
        .select('AVG(rating.value)', 'avg')
        .getRawOne();
      avgRating = result?.avg ? parseFloat(result.avg) : null;
    }

    const { password, ...rest } = user;
    return { ...rest, rating: avgRating };
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.usersRepo.update(userId, { password: hashedPassword });
  }

  async getStats() {
    const totalUsers = await this.usersRepo.count();
    return totalUsers;
  }
}
