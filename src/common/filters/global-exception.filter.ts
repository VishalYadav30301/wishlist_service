import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Request, Response } from 'express';
import { RpcException } from '@nestjs/microservices';

export interface ErrorResponse {
  statusCode: number;
  message: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.handleException(exception);
    
    // Only log the error message, not the stack trace or full error object
    let logMessage = `${request.method} ${request.url} ${errorResponse.statusCode} - ${errorResponse.message}`;
    if (exception instanceof Error && exception.message) {
      logMessage += ` | Root error: ${exception.message}`;
    }
    this.logger.error(logMessage);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private handleException(exception: unknown): ErrorResponse {
    // Handle HTTP Exceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();
      const message = typeof errorResponse === 'string' 
        ? errorResponse 
        : (errorResponse as any).message || 'An error occurred';
      
      return {
        statusCode: status,
        message: this.getUserFriendlyMessage(message),
      };
    }

    // Handle RPC Exceptions
    if (exception instanceof RpcException) {
      return {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: 'Service temporarily unavailable',
      };
    }

    // Handle MongoDB Exceptions
    if (exception instanceof MongoError) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Database operation failed',
      };
    }

    // Handle unknown errors
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
    };
  }

  private getUserFriendlyMessage(message: string): string {
    // Map technical error messages to user-friendly ones
    const messageMap: { [key: string]: string } = {
      'Failed to fetch product details': 'Unable to retrieve product information',
      'Product not found': 'The requested product could not be found',
      'Invalid product data format': 'Product information is incomplete',
      'Item already exists in wishlist': 'This item is already in your wishlist',
      'Wishlist not found': 'Your wishlist could not be found',
      'Item not found in wishlist': 'The item was not found in your wishlist',
      'Product ID is required': 'Please provide a valid product ID',
      'Failed to add item to cart': 'Unable to add item to cart',
    };

    return messageMap[message] || message;
  }
} 