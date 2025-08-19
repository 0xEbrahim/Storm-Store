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

@Injectable()
export class ClientCartService {
  constructor(
    @InjectModel(Cart.name) private CartModel: Model<Cart>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
  ) {}

  async create(
    { productId, quantity, color }: ClientCreateCartDto,
    userId: string,
  ) {
    let cart = await this.CartModel.findOne({ user: userId });
    if (!cart) cart = await this.CartModel.create({ user: userId });
    const product = await this.ProductModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');
    quantity = quantity ? quantity : 1;
    color = color ? color : '';
    const insertionIndex = cart.cartItems.findIndex(
      (e) => e.product.toString() === productId.toString(),
    );
    if (product.quantity < quantity)
      throw new BadRequestException('product quantity is not enough');
    if (insertionIndex === -1) {
      if (product.quantity < quantity)
        throw new BadRequestException('product quantity is not enough');
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

  async update(userId: string, updateCartDto: ClientUpdateCartDto) {
    const cart = await this.CartModel.findOne({ user: userId });
    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }
    const product = await this.ProductModel.findById(updateCartDto.productId);
    if (!product) throw new NotFoundException('Product not found');
    const exists = cart.cartItems.findIndex(
      (e) => e.product.toString() === updateCartDto.productId.toString(),
    );
    if (exists === -1)
      throw new BadRequestException('Product does not exist on your cart');

    const quantity = updateCartDto?.quantity ? updateCartDto?.quantity : 1;
    if (quantity > product.quantity)
      throw new BadRequestException('Product quantity is not enough');
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
      throw new BadRequestException('Your cart is empty');
    }
    const product = await this.ProductModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');
    const exists = cart.cartItems.findIndex(
      (e) => e.product.toString() === productId.toString(),
    );
    if (exists === -1)
      throw new BadRequestException('Product does not exist on your cart');
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
    return { message: 'Product removed from cart' };
  }
}
