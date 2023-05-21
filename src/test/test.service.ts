import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTestDto } from './dto/create-test.dto';
import { Test, TestDocument } from './test.model';
import {
  CATEGORY_NOT_FOUND_ERROR,
  TEST_NOT_FOUND_ERROR,
} from './test.constants';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test.name)
    private readonly testModel: Model<TestDocument>,
  ) {}

  async create(dto: CreateTestDto): Promise<Test> {
    return await this.testModel.create(dto);
  }

  async getTest(category: string): Promise<Test[]> {
    const array = await this.testModel
      .aggregate([{ $match: { category } }, { $sample: { size: 3 } }])
      .exec();

    if (!array.length) {
      throw new NotFoundException(CATEGORY_NOT_FOUND_ERROR);
    }

    return array;
  }

  async search(query: string): Promise<Test[]> {
    return await this.testModel
      .find({
        $text: { $search: query, $caseSensitive: false },
      })
      .exec();
  }

  async delete(id: string) {
    const deletedId = await this.testModel.findByIdAndDelete(id);

    if (!deletedId) {
      throw new NotFoundException(TEST_NOT_FOUND_ERROR);
    }

    return deletedId;
  }

  async updateById(id: string, dto: CreateTestDto): Promise<Test> {
    const updatedTest = await this.testModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updatedTest) {
      throw new NotFoundException(TEST_NOT_FOUND_ERROR);
    }

    return updatedTest;
  }
}
