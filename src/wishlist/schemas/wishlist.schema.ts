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

  @ApiProperty({
    description: 'Category of the product',
    example: 'Electronics',
    required: false,
  })
  @Prop()
  category?: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A high-quality electronic device.',
    required: false,
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'Variants of the product',
    example: [{ color: 'red', size: 'M' }],
    required: false,
    type: [Object],
  })
  @Prop({ type: [Object], default: [] })
  variants?: any[];

  @ApiProperty({
    description: 'Total stock of the product',
    example: 100,
    required: false,
  })
  @Prop()
  totalStock?: number;

  @ApiProperty({
    description: 'Reviews of the product',
    example: [{ user: 'user1', rating: 5, comment: 'Great!' }],
    required: false,
    type: [Object],
  })
  @Prop({ type: [Object], default: [] })
  reviews?: any[];
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

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt?: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt?: string;
}

export type WishlistDocument = Wishlist & Document;
export const WishlistSchema = SchemaFactory.createForClass(Wishlist);