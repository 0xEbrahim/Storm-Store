import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryProvider } from 'src/common/providers/cloudinary';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../admin/user/Schema/user.schema';
import { JWTService } from '../jwt/jwt.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CloudinaryController],
  providers: [CloudinaryProvider, CloudinaryService, JWTService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
