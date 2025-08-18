import { Module } from '@nestjs/common';
import { AdminSupplierService } from './supplier.service';
import { AdminSupplierController } from './supplier.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JWTService } from 'src/modules/jwt/jwt.service';
import { Supplier, SupplierSchema } from './schema/supplier.schema';
import { User, UserSchema } from '../user/Schema/user.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdminSupplierController],
  providers: [AdminSupplierService, JWTService],
})
export class AdminSupplierModule {}
