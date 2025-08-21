import path from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/admin/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule as ClientUserModule } from './modules/client/user/user.module';
import { AuthModule } from './modules/client/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { AdminCategoryModule } from './modules/admin/category/category.module';
import { ClientCategoryModule } from './modules/client/category/category.module';
import { AdminSubCategoryModule } from './modules/admin/sub-category/sub-category.module';
import { ClientSubCategoryModule } from './modules/client/sub-category/sub-category.module';
import { AdminBrandModule } from './modules/admin/brand/brand.module';
import { ClientBrandModule } from './modules/client/brand/brand.module';
import { AdminCouponModule } from './modules/admin/coupon/coupon.module';
import { AdminSupplierModule } from './modules/admin/supplier/supplier.module';
import { ClientSupplierModule } from './modules/client/supplier/supplier.module';
import { AdminTicketModule } from './modules/admin/ticket/ticket.module';
import { ClientTicketModule } from './modules/client/ticket/ticket.module';
import { AdminTaxModule } from './modules/admin/tax/tax.module';
import { AdminProductModule } from './modules/admin/product/product.module';
import { ClientProductModule } from './modules/client/product/product.module';
import { AdminReviewModule } from './modules/admin/review/review.module';
import { ClientReviewModule } from './modules/client/review/review.module';
import { ClientCartModule } from './modules/client/cart/cart.module';
import { AdminCartModule } from './modules/admin/cart/cart.module';
import { AdminOrderModule } from './modules/admin/order/order.module';
import { ClientOrderModule } from './modules/client/order/order.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bullmq';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE'),
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SMTP_HOST'),
          port: config.get<number>('SMTP_PORT'),
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASS'),
          },
        },
        template: {
          dir: path.join(__dirname, './templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_AC_SEC'),
        global: true,
      }),
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: `redis://${config.get<string>('REDIS_USERNAME')}:${config.get<string>('REDIS_PASS')}@${config.get<string>('REDIS_HOST')}:${config.get<string>('REDIS_PORT')}`,
      }),
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          url: config.get<string>('REDIS_URI'),
        },
        defaultJobOptions: {
          attempts: 15,
          removeOnComplete: 1000,
          removeOnFail: 3000,
        },
      }),
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URL'),
      }),
    }),
    UserModule,
    ClientUserModule,
    JwtModule,
    AuthModule,
    AdminCategoryModule,
    ClientCategoryModule,
    AdminSubCategoryModule,
    ClientSubCategoryModule,
    AdminBrandModule,
    ClientBrandModule,
    AdminCouponModule,
    AdminSupplierModule,
    ClientSupplierModule,
    AdminTicketModule,
    ClientTicketModule,
    AdminTaxModule,
    AdminProductModule,
    ClientProductModule,
    AdminReviewModule,
    ClientReviewModule,
    ClientCartModule,
    AdminCartModule,
    AdminOrderModule,
    ClientOrderModule,
    CloudinaryModule,
    HealthModule,
  ],
})
export class AppModule {}
