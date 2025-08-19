import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { User } from '../../user/Schema/user.schema';
import { Product, ProductSchema } from '../../product/schema/product.schema';

export interface ReviewDocument extends HydratedDocument<Review> {
  updateProductRating(prod: string): Promise<void>;
}

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: String, required: true, minLength: 4, maxLength: 500 })
  text: string;

  @Prop({ type: Number, required: true, min: 0, max: 5 })
  rating: number;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Product.name })
  product: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.statics.updateProductRating = async function (productId: string) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        nRatings: { $sum: 1 },
      },
    },
  ]);
  const ProductModel = this.db.model(Product.name);
  if (stats.length > 0) {
    const d = await ProductModel.findByIdAndUpdate(
      stats[0]._id.toString(),
      {
        averageRatings: stats[0].avgRating.toFixed(3),
        ratingsQuantity: stats[0].nRatings,
      },
      { new: true },
    );
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      averageRatings: 0,
      ratingsQuantity: 0,
    });
  }
};

ReviewSchema.post('save', async function () {
  await (this.constructor as any).updateProductRating(this.product);
});

ReviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.updateProductRating(doc.product);
});
