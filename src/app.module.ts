import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/admin/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule as ClientUserModule } from './modules/client/user/user.module';
import { AuthModule } from './modules/client/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
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
  ],
})
export class AppModule {}
