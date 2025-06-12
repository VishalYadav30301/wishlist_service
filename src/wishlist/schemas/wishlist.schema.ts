import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class WishlistItem {
  @ApiProperty({
    description: 'Product ID',
    example: 'product123',
  })
  @Prop({ required: true })
  productId: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Product Name',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 29.99,
  })
  @Prop({ required: true })
  price: number;

  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @Prop()
  image?: string;
}

@Schema({ timestamps: true })
export class Wishlist {
  @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({
    description: 'Items in the wishlist',
    type: [WishlistItem],
  })
  @Prop({ type: [WishlistItem], default: [] })
  items: WishlistItem[];
}

export type WishlistDocument = Wishlist & Document;
export const WishlistSchema = SchemaFactory.createForClass(Wishlist); 