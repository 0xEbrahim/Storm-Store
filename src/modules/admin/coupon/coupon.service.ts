import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateCouponDto } from './dto/create-coupon.dto';
import { AdminUpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './schema/coupon.schema';
import { Model } from 'mongoose';
import ApiFeatures from 'src/common/utils/APIFeatures';

@Injectable()
export class AdminCouponService {
  constructor(@InjectModel(Coupon.name) private CouponModel: Model<Coupon>) {}

  private async _CheckValidCoupon(_coupon: string) {
    const coupon = await this.CouponModel.findOne({ coupon: _coupon });
    if (coupon) throw new BadRequestException('Such a coupon already exists');
  }

  async create({ coupon: _coupon, discount, expireIn }: AdminCreateCouponDto) {
    await this._CheckValidCoupon(_coupon);
    const coupon = await this.CouponModel.create({
      coupon: _coupon,
      discount: discount,
      expireIn: expireIn,
    });
    return { data: { coupon } };
  }

  async findAll(q: any) {
    q.page = q.page ? q.page : 1;
    q.limit = q.limit ? q.limit : 10;
    const query = new ApiFeatures(this.CouponModel.find({}), q)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const coupons = await query.exec();
    return { data: { coupons }, page: +q.page, size: coupons.length };
  }

  async findOne(id: string) {
    const coupon = await this.CouponModel.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');
    return { data: { coupon } };
  }

  async update(id: string, updateCouponDto: AdminUpdateCouponDto) {
    let coupon = await this.CouponModel.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (updateCouponDto?.coupon)
      await this._CheckValidCoupon(updateCouponDto.coupon);
    coupon = await this.CouponModel.findByIdAndUpdate(id, updateCouponDto, {
      new: true,
    });
    return { data: { coupon } };
  }

  async remove(id: string) {
    let coupon = await this.CouponModel.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');
    await this.CouponModel.findByIdAndDelete(id);
  }
}
