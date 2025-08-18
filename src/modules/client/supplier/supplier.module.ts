import { Module } from '@nestjs/common';
import { ClientSupplierService } from './supplier.service';
import { ClientSupplierController } from './supplier.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Supplier,
  SupplierSchema,
} from 'src/modules/admin/supplier/schema/supplier.schema';
import { User, UserSchema } from 'src/modules/admin/user/Schema/user.schema';
import { JWTService } from 'src/modules/jwt/jwt.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ClientSupplierController],
  providers: [ClientSupplierService, JWTService],
})
export class ClientSupplierModule {}
