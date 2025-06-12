import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { AddWishlistItemDto } from './dto/add-item.dto';
import { ProductService } from '../product/services/product.service';
import { Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);

  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
    private productService: ProductService,
  ) {}

  async getWishlist(userId: string): Promise<Wishlist> {
    const wishlist = await this.findWishlistByUserId(userId);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  async addItem(userId: string, addItemDto: AddWishlistItemDto): Promise<Wishlist> {
    const product = await this.getProductDetails(addItemDto.productId);
    let wishlist = await this.findWishlistByUserId(userId);

    if (!wishlist) {
      wishlist = await this.createNewWishlist(userId);
    }

    const existingItem = wishlist.items.find(item => item.productId === addItemDto.productId);
    if (existingItem) {
      throw new BadRequestException('Item already exists in wishlist');
    }

    wishlist.items.push({
      productId: addItemDto.productId,
      name: product.name,
      price: product.price,
      image: product.imageUrl || '',
    });

    return this.saveWishlist(wishlist);
  }

  async removeItem(userId: string, productId: string): Promise<Wishlist> {
    const wishlist = await this.findWishlistByUserId(userId);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    const itemIndex = wishlist.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in wishlist');
    }

    wishlist.items.splice(itemIndex, 1);
    return this.saveWishlist(wishlist);
  }

  async clearWishlist(userId: string): Promise<Wishlist> {
    const wishlist = await this.findWishlistByUserId(userId);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    wishlist.items = [];
    return this.saveWishlist(wishlist);
  }

  private async findWishlistByUserId(userId: string): Promise<WishlistDocument | null> {
    return this.wishlistModel.findOne({ userId }).exec();
  }

  private async createNewWishlist(userId: string): Promise<WishlistDocument> {
    return new this.wishlistModel({
      userId,
      items: [],
    });
  }

  private async saveWishlist(wishlist: WishlistDocument): Promise<Wishlist> {
    return wishlist.save();
  }

  private async getProductDetails(productId: string) {
    try {
      const response = await lastValueFrom(this.productService.getProduct(productId));
      
      if (response.code !== 200) {
        throw new NotFoundException('Product not found');
      }

      const productData = JSON.parse(response.data);
      if (!productData || !productData.name || !productData.price) {
        throw new BadRequestException('Invalid product data format');
      }

      return {
        name: productData.name,
        price: productData.price,
        imageUrl: productData.imageUrl || '',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch product details: ${error.message}`);
      throw new BadRequestException('Failed to fetch product details');
    }
  }
} 