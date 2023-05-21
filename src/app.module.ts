import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { getMongoConfig } from './configs/mongo.config';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    AuthModule,
    TestModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMongoConfig,
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
