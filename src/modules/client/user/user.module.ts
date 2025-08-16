import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/admin/user/Schema/user.schema';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, JWTService],
})
export class UserModule {}
