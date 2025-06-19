import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

interface CartService {
  addToCart(request: {
    userId: string;
    items: Array<{
      productId: string;
      description: string;
      color: string;
      size: string;
      quantity: number;
      price: number;
    }>;
  }): Promise<{ items: Array<{
    productId: string;
    description: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  }> }>;
}

@Injectable()
export class CartGrpcService {
  private readonly logger = new Logger(CartGrpcService.name);
  private cartService: CartService;

  constructor(@Inject('CART_PACKAGE') private client: ClientGrpc) {
    try {
      this.logger.log('Initializing CartGrpcService...');
      this.logger.log(`CART_SERVICE_URL: ${process.env.CART_SERVICE_URL}`);
      // The service name must match the proto: 'CartService'
      this.cartService = this.client.getService<CartService>('CartService');
      this.logger.log('CartService successfully initialized with service name: CartService');
    } catch (error) {
      this.logger.error(`Failed to initialize CartService: ${error.message}`, error.stack);
      throw error;
    }
  }

  async addToCart(userId: string, items: Array<{ productId: string; quantity: number }>) {
    try {
      this.logger.debug(`Attempting to add items to cart for userId: ${userId}`);
      this.logger.debug(`Items to add: ${JSON.stringify(items)}`);
      
      if (!this.cartService) {
        this.logger.error('CartService is not initialized');
        throw new Error('CartService is not initialized');
      }

      if (!userId) {
        this.logger.error('userId is required');
        throw new Error('userId is required');
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        this.logger.error('items array is required and must not be empty');
        throw new Error('items array is required and must not be empty');
      }

      // Transform items to match the proto definition
      const transformedItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        description: '',  // These fields will be populated by the cart service
        color: '',       // based on the product details
        size: '',        // from the product service
        price: 0         // 
      }));

      this.logger.debug(`Transformed items: ${JSON.stringify(transformedItems)}`);
      this.logger.debug(`Making gRPC call to cart service at: ${process.env.CART_SERVICE_URL}`);

      const result = await this.cartService.addToCart({ 
        userId, 
        items: transformedItems 
      });

      this.logger.debug(`Cart service response: ${JSON.stringify(result)}`);
      
      if (!result) {
        this.logger.error('Cart service returned null or undefined response');
        throw new Error('Cart service returned null or undefined response');
      }

      // Check if result is empty object
      if (Object.keys(result).length === 0) {
        this.logger.error('Cart service returned empty response object');
        throw new Error('Cart service returned empty response - service may be unavailable');
      }
      
      return result;
    } catch (error) {
      this.logger.error(`gRPC call to addToCart failed: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
      if (error.code) {
        this.logger.error(`gRPC error code: ${error.code}`);
      }
      if (error.details) {
        this.logger.error(`gRPC error details: ${error.details}`);
      }
      throw error;
    }
  }
} 