import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Wishlist } from './schemas/wishlist.schema';
import { AddWishlistItemDto } from './dto/add-item.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('Wishlist')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get wishlist details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the wishlist details',
    type: Wishlist,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Wishlist not found' })
  async getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.entityId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to wishlist' })
  @ApiResponse({
    status: 201,
    description: 'Item added to wishlist successfully',
    type: Wishlist,
  })
  @ApiResponse({ status: 400, description: 'Invalid input or item already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addItem(
    @Request() req,
    @Body() addItemDto: AddWishlistItemDto,
  ) {
    return this.wishlistService.addItem(req.user.entityId, addItemDto);
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove item from wishlist' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Item removed successfully',
    type: Wishlist,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Wishlist or item not found' })
  async removeItem(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeItem(req.user.entityId, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Wishlist cleared successfully',
    type: Wishlist,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Wishlist not found' })
  async clearWishlist(@Request() req) {
    return this.wishlistService.clearWishlist(req.user.entityId);
  }
} 