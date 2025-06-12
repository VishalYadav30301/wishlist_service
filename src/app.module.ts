import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    // ClientsModule.register([
    //   {
    //     name: 'PRODUCT_PACKAGE',
    //     transport: Transport.GRPC,
    //     options: {
    //       package: 'product',
    //       protoPath: join(process.cwd(), 'src/proto/product.proto'),
    //       url: process.env.PRODUCT_SERVICE_URL || '172.50.0.217:5001',
    //     },
    //   },
    // ]),
    CartModule,
    WishlistModule,
  ],
})
export class AppModule {}
