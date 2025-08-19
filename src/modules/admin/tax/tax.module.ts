import { Module } from '@nestjs/common';
import { AdminTaxService } from './tax.service';
import { AdminTaxController } from './tax.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Tax, taxSchema } from './schema/tax.schema';
import { User, UserSchema } from '../user/Schema/user.schema';
import { JWTService } from 'src/modules/jwt/jwt.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Tax.name, schema: taxSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdminTaxController],
  providers: [AdminTaxService, JWTService],
})
export class AdminTaxModule {}
