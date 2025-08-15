import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/Auth/auth.module';
import { CategoryModule } from './modules/Category/category.module';
import { ProductModule } from './modules/Product/product.module';
import { CartModule } from './modules/Cart/cart.module';
import { OrderModule } from './modules/Order/order.module';
import { PaymentModule } from './modules/Payment/payment.module';
import { AdminModule } from './modules/Admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') == 'development',
      }),
    }),
    AuthModule,
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
