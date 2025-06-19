import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { AddItemsDto } from './dto/AddItemsDto';
import { ProductService } from '../product/services/product.service';
import { lastValueFrom } from 'rxjs';
import { CartGrpcService } from './services/cart-grpc.service';
import { HttpException } from '@nestjs/common';

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);
  private readonly cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
    private productService: ProductService,
    private readonly cartGrpcService: CartGrpcService,
  ) {}

  async getWishlist(userId: string): Promise<Wishlist> {
    try {
      this.logger.debug(`Getting wishlist for user: ${userId}`);
      const wishlist = await this.findWishlistByUserId(userId);
      if (!wishlist) {
        this.logger.warn(`Wishlist not found for user: ${userId}`);
        throw new NotFoundException('Wishlist not found');
      }

      this.logger.debug(`Wishlist retrieved successfully for user: ${userId}`);
      return wishlist;
    } catch (error) {
      this.logger.error(
        `Failed to get wishlist for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  async addItem(userId: string, addItemDto: AddItemsDto): Promise<Wishlist> {
    try {
      this.logger.debug(
        `Adding item to wishlist for user: ${userId}, product: ${addItemDto.productId}`,
      );

      if (!addItemDto.productId) {
        throw new BadRequestException('Product ID is required');
      }

      const product = await this.getProductDetailsWithCache(
        addItemDto.productId,
      );
      let wishlist = await this.findWishlistByUserId(userId);

      if (!wishlist) {
        this.logger.debug(`Creating new wishlist for user: ${userId}`);
        wishlist = await this.createNewWishlist(userId);
      }

      const existingItem = wishlist.items.find(
        (item) => item.productId === addItemDto.productId,
      );
      if (existingItem) {
        this.logger.warn(
          `Item ${addItemDto.productId} already exists in wishlist for user: ${userId}`,
        );
        throw new BadRequestException('Item already exists in wishlist');
      }

      wishlist.items.push({
        productId: addItemDto.productId,
        name: product.name,
        price: product.price,
        image: product.imageUrl || '',
        category: product.category || '',
        description: product.description || '',
        variants: product.variants || [],
        totalStock: product.totalStock || 0,
        reviews: product.reviews || [],
      });
      wishlist.updatedAt = new Date().toISOString();

      const savedWishlist = await this.saveWishlist(wishlist);
      this.logger.debug(
        `Item added successfully to wishlist for user: ${userId}`,
      );

      this.clearUserCache(userId);
      return savedWishlist;
    } catch (error) {
      this.logger.error(
        `Failed to add item to wishlist for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  async removeItem(userId: string, productId: string): Promise<Wishlist> {
    try {
      this.logger.debug(
        `Removing item from wishlist for user: ${userId}, product: ${productId}`,
      );

      const wishlist = await this.findWishlistByUserId(userId);
      if (!wishlist) {
        this.logger.warn(`Wishlist not found for user: ${userId}`);
        throw new NotFoundException('Wishlist not found');
      }

      const itemIndex = wishlist.items.findIndex(
        (item) => item.productId === productId,
      );
      if (itemIndex === -1) {
        this.logger.warn(
          `Item ${productId} not found in wishlist for user: ${userId}`,
        );
        throw new NotFoundException('Item not found in wishlist');
      }

      wishlist.items.splice(itemIndex, 1);
      wishlist.updatedAt = new Date().toISOString();

      const savedWishlist = await this.saveWishlist(wishlist);
      this.logger.debug(
        `Item removed successfully from wishlist for user: ${userId}`,
      );

      this.clearUserCache(userId);
      return savedWishlist;
    } catch (error) {
      this.logger.error(
        `Failed to remove item from wishlist for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  async clearWishlist(userId: string): Promise<Wishlist> {
    try {
      this.logger.debug(`Clearing wishlist for user: ${userId}`);

      const wishlist = await this.findWishlistByUserId(userId);
      if (!wishlist) {
        this.logger.warn(`Wishlist not found for user: ${userId}`);
        throw new NotFoundException('Wishlist not found');
      }

      wishlist.items = [];
      wishlist.updatedAt = new Date().toISOString();

      const savedWishlist = await this.saveWishlist(wishlist);
      this.logger.debug(`Wishlist cleared successfully for user: ${userId}`);

      this.clearUserCache(userId);
      return savedWishlist;
    } catch (error) {
      this.logger.error(
        `Failed to clear wishlist for user ${userId}:`,
        error.stack,
      );
      throw error;
    }
  }

  async addToCart(userId: string, addToCartDto: AddItemsDto): Promise<any> {
    try {
      this.logger.debug(
        `Adding wishlist item to cart for user: ${userId}, product: ${addToCartDto.productId}`,
      );

      if (!addToCartDto.productId) {
        throw new BadRequestException('Product ID is required');
      }

      const product = await this.getProductDetailsWithCache(
        addToCartDto.productId,
      );
      this.logger.debug(
        `Retrieved product details: ${JSON.stringify(product)}`,
      );

      const cartItem = {
        productId: addToCartDto.productId,
        quantity: addToCartDto.quantity || 1,
      };

      this.logger.debug('Making gRPC call to cart service...');
      this.logger.debug(`Cart item: ${JSON.stringify(cartItem)}`);

      try {
        this.logger.debug('About to call cartGrpcService.addToCart...');
        const result = await this.cartGrpcService.addToCart(userId, [cartItem]);
        this.logger.debug('cartGrpcService.addToCart call completed successfully');
        this.logger.debug(`Cart service response: ${JSON.stringify(result)}`);

        if (!result) {
          this.logger.error('Cart service returned null or undefined response');
          throw new BadRequestException('Failed to add item to cart - no response from cart service');
        }

        if (Object.keys(result).length === 0) {
          this.logger.error('Cart service returned empty response object');
          throw new BadRequestException('Cart service returned empty response - service may be unavailable');
        }

        if (!result.items || !Array.isArray(result.items)) {
          this.logger.error(
            `Invalid response format from cart service: ${JSON.stringify(result)}`,
          );
          throw new BadRequestException('Invalid response format from cart service');
        }

        this.logger.debug(
          'Cart addition successful, removing item from wishlist...',
        );
        await this.removeItem(userId, addToCartDto.productId);

        this.logger.debug(
          `Item successfully added to cart and removed from wishlist for user: ${userId}`,
        );
        return {
          success: true,
          message: 'Item added to cart successfully',
          productId: addToCartDto.productId,
          cartItems: result.items,
        };
      } catch (error) {
        this.logger.error(`Error from cart service: ${error.message}`);
        this.logger.error(`Error stack: ${error.stack}`);
        if (error.code) {
          this.logger.error(`gRPC error code: ${error.code}`);
        }
        if (error.details) {
          this.logger.error(`gRPC error details: ${error.details}`);
        }
        throw new BadRequestException(`Unable to add item to cart: ${error.message}`);
      }
    } catch (error) {
      this.logger.error(`Error in addToCart: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Unable to add item to cart');
    }
  }

  private async findWishlistByUserId(
    userId: string,
  ): Promise<WishlistDocument | null> {
    const cacheKey = `wishlist:${userId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.logger.debug(`Returning cached wishlist for user: ${userId}`);
      return cached.data;
    }

    const wishlist = await this.wishlistModel.findOne({ userId }).exec();

    if (wishlist) {
      this.cache.set(cacheKey, { data: wishlist, timestamp: Date.now() });
    }

    return wishlist;
  }

  private async createNewWishlist(userId: string): Promise<WishlistDocument> {
    const now = new Date().toISOString();
    return new this.wishlistModel({
      userId,
      items: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  private async saveWishlist(wishlist: WishlistDocument): Promise<Wishlist> {
    return wishlist.save();
  }

  private async getProductDetailsWithCache(productId: string) {
    const cacheKey = `product:${productId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.logger.debug(`Returning cached product details for: ${productId}`);
      return cached.data;
    }

    try {
      const response = await lastValueFrom(
        this.productService.getProduct(productId),
      );

      if (response.code !== 200) {
        throw new NotFoundException('Product not found');
      }

      const productData = JSON.parse(response.data);
      if (!productData || !productData.name || !productData.price) {
        throw new BadRequestException('Invalid product data format');
      }

      const productDetails = {
        name: productData.name,
        price: productData.price,
        imageUrl: productData.imageUrl || '',
        category: productData.category || '',
        description: productData.description || '',
        variants: productData.variants || [],
        totalStock: productData.totalStock || 0,
        reviews: productData.reviews || [],
      };

      this.cache.set(cacheKey, { data: productDetails, timestamp: Date.now() });
      return productDetails;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch product details');
    }
  }

  private clearUserCache(userId: string): void {
    const cacheKey = `wishlist:${userId}`;
    this.cache.delete(cacheKey);
    this.logger.debug(`Cleared cache for user: ${userId}`);
  }

  clearAllCache(): void {
    this.cache.clear();
    this.logger.debug('All cache cleared');
  }
}
