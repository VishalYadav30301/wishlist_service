<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Cart Microservice

A robust and scalable cart microservice built with NestJS, TypeScript, and MongoDB, designed for e-commerce applications.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)

## Features

- Add items to cart
- Remove items from cart
- Update item quantities
- Clear cart
- Get cart details
- Persistent cart storage
- Input validation
- Error handling
- Swagger API documentation
- Logging
- Rate limiting
- CORS support
- Environment-based configuration

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Error Handling**: Custom exception filters
- **Logging**: Built-in NestJS Logger
- **Testing**: Jest
- **API Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm (v8 or higher) or yarn (v1.22 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cart-microservice
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Application
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cart-service

# CORS
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

4. Start the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Configuration

The application uses environment variables for configuration. Key configurations include:

### Application Settings
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: CORS origin setting

### Database Settings
- `MONGODB_URI`: MongoDB connection string
- `MONGODB_USER`: MongoDB username (optional)
- `MONGODB_PASSWORD`: MongoDB password (optional)

### Rate Limiting
- `RATE_LIMIT_WINDOW`: Time window in minutes
- `RATE_LIMIT_MAX`: Maximum requests per window

## API Documentation

The API documentation is available at `http://localhost:3000/api` when the server is running.

### Endpoints

#### 1. Get Cart
```http
GET /cart
```
Returns the current cart for the user.

Response:
```json
{
    "userId": "string",
    "items": [
        {
            "productId": "string",
            "quantity": number,
            "price": number,
            "name": "string",
            "image": "string"
        }
    ],
    "totalAmount": number
}
```

#### 2. Add Item to Cart
```http
POST /cart/items
Content-Type: application/json

{
    "productId": "string",
    "quantity": number,
    "price": number,
    "name": "string",
    "image": "string"
}
```

Validation Rules:
- `productId`: Required, string
- `quantity`: Required, minimum 1
- `price`: Required, minimum 0
- `name`: Optional, string
- `image`: Optional, string

#### 3. Update Item Quantity
```http
PUT /cart/items/:productId
Content-Type: application/json

{
    "quantity": number
}
```

Validation Rules:
- `quantity`: Required, minimum 1

#### 4. Remove Item
```http
DELETE /cart/items/:productId
```

#### 5. Clear Cart
```http
DELETE /cart
```

## Error Handling

The service implements three types of exception filters:

1. **HttpExceptionFilter**: Handles HTTP exceptions
   - 400 Bad Request
   - 404 Not Found
   - 500 Internal Server Error

2. **MongoExceptionFilter**: Handles MongoDB-specific errors
   - Duplicate key errors (409 Conflict)
   - Validation errors (400 Bad Request)
   - Connection errors (503 Service Unavailable)

3. **ValidationExceptionFilter**: Handles validation errors
   - Input validation failures
   - Schema validation errors

### Error Response Format
```json
{
    "statusCode": number,
    "timestamp": "string",
    "path": "string",
    "method": "string",
    "message": "string",
    "errors": string[] // for validation errors
}
```

## Project Structure

```
src/
├── cart/
│   ├── dto/
│   │   ├── add-item.dto.ts
│   │   └── update-item.dto.ts
│   ├── schemas/
│   │   └── cart.schema.ts
│   ├── cart.controller.ts
│   ├── cart.service.ts
│   └── cart.module.ts
├── common/
│   ├── constants/
│   │   └── error-messages.ts
│   └── filters/
│       ├── http-exception.filter.ts
│       ├── mongo-exception.filter.ts
│       └── validation-exception.filter.ts
├── config/
│   └── configuration.ts
├── app.module.ts
└── main.ts
```

## Development

### Available Scripts

- `npm run start`: Start the application
- `npm run start:dev`: Start the application in development mode with hot-reload
- `npm run build`: Build the application
- `npm run start:prod`: Start the application in production mode
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
- `npm run test`: Run unit tests
- `npm run test:e2e`: Run end-to-end tests
- `npm run test:cov`: Generate test coverage

### Code Style

The project uses ESLint and Prettier for code formatting. Configuration files:
- `.eslintrc.js`: ESLint configuration
- `.prettierrc`: Prettier configuration

Run the following commands:
```bash
npm run lint
npm run format
```

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## Deployment

### Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your_production_mongodb_uri
```

3. Start the application:
```bash
npm run start:prod
```

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t cart-microservice .
```

2. Run the container:
```bash
docker run -p 3000:3000 cart-microservice
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Check MongoDB service is running
   - Verify connection string
   - Check network connectivity

2. **Validation Errors**
   - Ensure all required fields are provided
   - Check data types match schema
   - Verify minimum/maximum values

3. **Performance Issues**
   - Check MongoDB indexes
   - Monitor memory usage
   - Review query performance

## Security Considerations

1. **Input Validation**
   - All inputs are validated using DTOs
   - SQL injection prevention
   - XSS protection

2. **Rate Limiting**
   - Implemented to prevent abuse
   - Configurable limits
   - IP-based tracking

3. **CORS**
   - Configurable origins
   - Secure headers
   - Preflight handling

## Performance Optimization

1. **Database**
   - Indexed fields
   - Efficient queries
   - Connection pooling

2. **Caching**
   - Response caching
   - Query result caching
   - Memory optimization

3. **Code Optimization**
   - Lazy loading
   - Efficient algorithms
   - Memory management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Pull Request Process

1. Update the README.md with details of changes
2. Update the documentation
3. Add tests for new features
4. Ensure all tests pass
5. Update the version number

## License

This project is licensed under the MIT License.

# Wishlist Module

A robust and scalable Wishlist module for e-commerce applications, built with NestJS, TypeScript, and MongoDB. This module allows users to manage their wishlist, add/remove items, and move items to the cart via gRPC microservices.

## Features

- Add items to wishlist
- Remove items from wishlist
- Clear wishlist
- Get wishlist details
- Move wishlist items to cart (gRPC integration)
- Input validation and error handling
- Caching for performance
- Swagger API documentation
- Logging

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **API Docs:** Swagger/OpenAPI
- **Validation:** class-validator
- **gRPC Microservices:** Product, Auth, Cart

## Endpoints

All endpoints require JWT authentication.

| Method | Endpoint                | Description                        |
|--------|-------------------------|------------------------------------|
| GET    | `/wishlist`             | Get wishlist details               |
| POST   | `/wishlist/items`       | Add item to wishlist               |
| DELETE | `/wishlist/items/:id`   | Remove item from wishlist          |
| DELETE | `/wishlist`             | Clear wishlist                     |
| POST   | `/wishlist/addToCart`   | Move item from wishlist to cart    |

### Example DTO: AddItemsDto

```typescript
export class AddItemsDto {
  productId: string; // required
  quantity?: number; // optional, default 1
}
```

## Wishlist Schema

```typescript
export class Wishlist {
  userId: string;
  items: WishlistItem[];
  createdAt?: string;
  updatedAt?: string;
}

export class WishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
  variants?: any[];
  totalStock?: number;
  reviews?: any[];
}
```

## Usage

### Installation

```bash
npm install
```

### Running the Service

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Environment Variables

You must configure the following environment variables for gRPC and MongoDB connections:

```
MONGODB_URI=mongodb://localhost:27017/your-db
PRODUCT_SERVICE_URL=grpc://localhost:50051
AUTH_SERVICE_URL=grpc://localhost:50052
CART_SERVICE_URL=grpc://localhost:50053
```

### Example Request: Add Item to Wishlist

```http
POST /wishlist/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product123",
  "quantity": 1
}
```

### Example Request: Move Item to Cart

```http
POST /wishlist/addToCart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product123",
  "quantity": 1
}
```

## Error Handling

- Returns `404` if wishlist or item is not found.
- Returns `400` for invalid input or if item already exists.
- Returns `401` for unauthorized access.

## Caching

- In-memory caching is used for wishlist and product details to improve performance.
- Cache TTL: 5 minutes.

## Project Structure

```
src/wishlist/
  ├── dto/
  │   └── AddItemsDto.ts
  ├── schemas/
  │   └── wishlist.schema.ts
  ├── services/
  │   └── cart-grpc.service.ts
  ├── wishlist.controller.ts
  ├── wishlist.module.ts
  └── wishlist.service.ts
```

## Testing

```bash
npm run test
```

## API Documentation

Swagger docs are available at `/api` when the app is running.
