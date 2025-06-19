import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WishlistService } from './wishlist.service';
import { Wishlist } from './schemas/wishlist.schema';
import { ProductService } from '../product/services/product.service';
import { CartGrpcService } from './services/cart-grpc.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AddItemsDto } from './dto/AddItemsDto';
import { of } from 'rxjs';


describe('WishlistService', () => {
  let service: WishlistService;
  let productService: ProductService;
  let cartGrpcService: CartGrpcService;
  let wishlistModel: Model<Wishlist>;

  const mockWishlistModel = {
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProductService = {
    getProduct: jest.fn(),
  };

  const mockCartGrpcService = {
    addItemsToCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: getModelToken(Wishlist.name),
          useValue: mockWishlistModel,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: CartGrpcService,
          useValue: mockCartGrpcService,
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    productService = module.get<ProductService>(ProductService);
    cartGrpcService = module.get<CartGrpcService>(CartGrpcService);
    wishlistModel = module.get<Model<Wishlist>>(getModelToken(Wishlist.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    const userId = 'test-user-id';
    const productId = 'test-product-id';
    const addToCartDto: AddItemsDto = {
      productId,
      quantity: 1,
    };

    const mockProduct = {
      name: 'Test Product',
      price: 99.99,
      imageUrl: 'test-image-url',
    };

    const mockWishlist = {
      userId,
      items: [
        {
          productId,
          name: mockProduct.name,
          price: mockProduct.price,
          image: mockProduct.imageUrl,
        },
      ],
      save: jest.fn().mockResolvedValue({
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
      }),
    };

    it('should successfully add item to cart and remove from wishlist', async () => {
      // Mock product service response
      mockProductService.getProduct.mockReturnValue(of({
        code: 200,
        data: JSON.stringify(mockProduct),
      }));

      // Mock wishlist model response
      mockWishlistModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockWishlist),
      });

      // Mock cart service response
      mockCartGrpcService.addItemsToCart.mockResolvedValue({
        success: true,
        message: 'Item added to cart successfully',
      });

      const result = await service.addToCart(userId, addToCartDto);

      expect(result).toEqual({
        success: true,
        message: 'Item added to cart successfully',
        productId,
      });

      expect(mockCartGrpcService.addItemsToCart).toHaveBeenCalledWith(userId, [
        { productId, quantity: 1 },
      ]);
      expect(mockWishlistModel.findOne).toHaveBeenCalledWith({ userId });
    });

    it('should throw BadRequestException if product ID is not provided', async () => {
      const invalidDto = { quantity: 1 } as AddItemsDto;

      await expect(service.addToCart(userId, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if cart service fails', async () => {
      mockProductService.getProduct.mockReturnValue(of({
        code: 200,
        data: JSON.stringify(mockProduct),
      }));

      mockWishlistModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockWishlist),
      });

      mockCartGrpcService.addItemsToCart.mockResolvedValue({
        success: false,
        message: 'Failed to add item to cart',
      });

      await expect(service.addToCart(userId, addToCartDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if product is not found', async () => {
      mockProductService.getProduct.mockReturnValue(of({
        code: 404,
        data: null,
      }));

      await expect(service.addToCart(userId, addToCartDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});