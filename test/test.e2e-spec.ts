import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect } from 'mongoose';

import { CreateTestDto } from '../src/test/dto/create-test.dto';
import { SignInDto } from '../src/auth/dto/signin.dto';
import { AppModule } from '../src/app.module';
import { CATEGORY_NOT_FOUND_ERROR } from '../src/test/test.constants';

const testLogInDto: SignInDto = {
  email: 'testLogIn@test.com',
  password: 'test123@',
};

const testDto: CreateTestDto = {
  category: 'theory',
  question: 'string?',
  answers: ['yes', 'no', "I don't no"],
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/user/login')
      .send(testLogInDto);
    token = body.token;
  });

  it('/test/create (POST) - success', async () => {
    try {
      const { body } = await request(app.getHttpServer())
        .post('/test/create')
        .set('Authorization', `Bearer ${token}`)
        .send(testDto)
        .expect(201);

      createdId = body._id;
      return expect(createdId).toBeDefined();
    } catch (error) {
      console.log('error:', error);
    }
  });

  it('/test/:category (GET) - success', async () => {
    try {
      const { body } = await request(app.getHttpServer())
        .get(`/test/${testDto.category}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      return expect(body.length).toBe(1);
    } catch (error) {
      console.log('error:', error);
    }
  });

  it('/test/:category (GET) - fail', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/test/:category`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    return expect(body.message).toBe(CATEGORY_NOT_FOUND_ERROR);
  });

  it('/tests/:category (GET) - fail', async () => {
    try {
      return await request(app.getHttpServer())
        .get(`/test/${testDto.category}`)
        .set('Authorization', `Bearer token`)
        .expect(401);
    } catch (error) {
      console.log('error:', error);
    }
  });

  it('/test/:id (DELETE) - success', async () => {
    try {
      const { body } = await request(app.getHttpServer())
        .delete(`/test/${createdId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      return expect(body._id).toEqual(createdId);
    } catch (error) {
      console.log('error:', error);
    }
  });

  afterAll(() => {
    disconnect();
  });
});
