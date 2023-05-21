import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TestService } from './test.service';
import { TestController } from './test.controller';
import { Test, TestSchema } from './test.model';

@Module({
  providers: [TestService],
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  controllers: [TestController],
  exports: [TestService],
})
export class TestModule {}
