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
import path from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
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
  ],
})
export class AppModule {}
