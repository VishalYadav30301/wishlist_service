import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Wishlist API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api (GET) - should return Swagger documentation', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200);
  });

  it('/wishlist (GET) - should require authentication', () => {
    return request(app.getHttpServer())
      .get('/wishlist')
      .expect(401);
  });
});
