import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientCreateCartDto } from './dto/create-cart.dto';
import { ClientUpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from 'src/modules/admin/cart/schema/cart.schema';
import { Model } from 'mongoose';
import { Product } from 'src/modules/admin/product/schema/product.schema';
import { Coupon } from 'src/modules/admin/coupon/schema/coupon.schema';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ClientCartService {
  constructor(
    @InjectModel(Cart.name) private CartModel: Model<Cart>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(Coupon.name) private CouponModel: Model<Coupon>,
    private readonly i18n: I18nService,
  ) {}

  async create(
    { productId, quantity, color }: ClientCreateCartDto,
    userId: string,
  ) {
    let cart = await this.CartModel.findOne({ user: userId });
    if (!cart) cart = await this.CartModel.create({ user: userId });
    const product = await this.ProductModel.findById(productId);
    if (!product)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.PRODUCT'),
          },
        }),
      );
    quantity = quantity ? quantity : 1;
    color = color ? color : '';
    const insertionIndex = cart.cartItems.findIndex(
      (e) => e.product.toString() === productId.toString(),
    );
    if (product.quantity < quantity)
      throw new BadRequestException(
        await this.i18n.t('service.INSUFFICIENT_QUANTITY'),
      );
    if (insertionIndex === -1) {
      if (product.quantity < quantity)
        throw new BadRequestException(
          await this.i18n.t('service.INSUFFICIENT_QUANTITY'),
        );
      cart.cartItems.push({
        product: productId,
        quantity,
        color,
      });
    } else {
      cart.cartItems[insertionIndex].quantity += quantity;
    }
    await cart.populate('cartItems.product', 'price discountPrice');
    let totalPrice = 0,
      totalDiscountPrice = 0;
    cart.cartItems.map((e) => {
      totalPrice += e.quantity * (e.product as any).price;
      totalDiscountPrice += e.quantity * (e.product as any).discountPrice;
    });
    cart.totalPrice = totalPrice - totalDiscountPrice;
    await cart.save();
    return { data: { cart } };
  }

  async findOne(userId: string) {
    let cart = await this.CartModel.findOne({ user: userId });
    if (!cart) cart = await this.CartModel.create({ user: userId });
    return { data: { cart } };
  }

  async applyCoupon(_coupon: string, userId: string) {
    const cart = await this.CartModel.findOne({ user: userId });
    const coupon = await this.CouponModel.findOne({ coupon: _coupon });
    if (!cart || cart.cartItems.length === 0)
      throw new BadRequestException(
        await this.i18n.t('service.EMPTY_CART_COUPON'),
      );
    if (!coupon || coupon.expireIn <= new Date(Date.now()))
      throw new BadRequestException(
        await this.i18n.t('service.INVALID_COUPON'),
      );
    const alreadyExists = cart.coupons.findIndex(
      (e) => e.toString() === _coupon.toString(),
    );
    if (alreadyExists !== -1)
      throw new BadRequestException(
        await this.i18n.t('service.COUPON_ALREADY_USED'),
      );
    if (cart.totalPrice <= 0)
      throw new BadRequestException(
        await this.i18n.t('service.FULL_DISCOUNT_ALREADY_APPLIED'),
      );
    cart.coupons.push(_coupon);
    cart.totalPrice = Math.max(0, cart.totalPrice - coupon.discount);
    await cart.save();
    return { data: { cart } };
  }

  async update(userId: string, updateCartDto: ClientUpdateCartDto) {
    const cart = await this.CartModel.findOne({ user: userId });
    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException(await this.i18n.t('service.EMPTY_CART'));
    }
    const product = await this.ProductModel.findById(updateCartDto.productId);
    if (!product)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.PRODUCT'),
          },
        }),
      );
    const exists = cart.cartItems.findIndex(
      (e) => e.product.toString() === updateCartDto.productId.toString(),
    );
    if (exists === -1)
      throw new BadRequestException(
        await this.i18n.t('service.PRODUCT_NOT_IN_CART'),
      );

    const quantity = updateCartDto?.quantity ? updateCartDto?.quantity : 1;
    if (quantity > product.quantity)
      throw new BadRequestException(
        await this.i18n.t('service.INSUFFICIENT_QUANTITY'),
      );
    cart.cartItems[exists].quantity = quantity;
    await cart.populate('cartItems.product', 'price discountPrice');
    let totalPrice = 0,
      totalDiscountPrice = 0;
    cart.cartItems.map((e) => {
      totalPrice += e.quantity * (e.product as any).price;
      totalDiscountPrice += e.quantity * (e.product as any).discountPrice;
    });
    cart.totalPrice = totalPrice - totalDiscountPrice;
    await cart.save();
    return { data: { cart } };
  }

  async remove(userId: string, productId: string) {
    let cart = await this.CartModel.findOne({ user: userId });
    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException(await this.i18n.t('service.EMPTY_CART'));
    }
    const product = await this.ProductModel.findById(productId);
    if (!product)
      throw new NotFoundException(
        await this.i18n.t('service.NOT_FOUND', {
          args: {
            name: await this.i18n.t('common.PRODUCT'),
          },
        }),
      );
    const exists = cart.cartItems.findIndex(
      (e) => e.product.toString() === productId.toString(),
    );
    if (exists === -1)
      throw new BadRequestException(
        await this.i18n.t('service.PRODUCT_NOT_IN_CART'),
      );
    await this.CartModel.findOneAndUpdate(
      { user: userId },
      { $pull: { cartItems: { product: productId } } },
      { new: true },
    );
    await cart.save();
    await cart.populate('cartItems.product', 'price discountPrice');
    let totalPrice = 0,
      totalDiscountPrice = 0;
    cart.cartItems.map((e) => {
      totalPrice += e.quantity * (e.product as any).price;
      totalDiscountPrice += e.quantity * (e.product as any).discountPrice;
    });
    cart.totalPrice = totalPrice - totalDiscountPrice;
    await cart.save();
    return { message: await this.i18n.t('service.PRODUCT_REMOVED_FROM_CART') };
  }
}
