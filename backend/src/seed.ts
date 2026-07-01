/**
 * Run with: npx ts-node -r tsconfig-paths/register src/seed.ts
 * Creates the first System Administrator account.
 */
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User, UserRole } from './users/entities/user.entity';
import { Store } from './stores/entities/store.entity';
import { Rating } from './ratings/entities/rating.entity';
import { Notification } from './notifications/entities/notification.entity';

dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Store, Rating, Notification],
    synchronize: true,
  });

  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);

  const existingAdmin = await userRepo.findOne({ where: { email: 'admin@storerating.com' } });
  if (existingAdmin) {
    console.log('Admin already exists. Skipping.');
    await dataSource.destroy();
    return;
  }

  const hashed = await bcrypt.hash('Admin@1234', 10);
  const admin = userRepo.create({
    name: 'System Administrator Account User', // must be 20-60 chars
    email: 'admin@storerating.com',
    password: hashed,
    address: 'Head Office, Platform Administration Building',
    role: UserRole.ADMIN,
  });

  await userRepo.save(admin);
  console.log('Admin user created: admin@storerating.com / Admin@1234');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
