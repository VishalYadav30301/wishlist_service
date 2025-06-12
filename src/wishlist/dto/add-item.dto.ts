import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddWishlistItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'product123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  productId: string;
} 