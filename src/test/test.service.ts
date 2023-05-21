import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTestDto } from './dto/create-test.dto';
import { Test, TestDocument } from './test.model';

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
    return await this.testModel
      .aggregate([{ $match: { category } }, { $sample: { size: 3 } }])
      .exec();
  }

  async search(query: string): Promise<Test[]> {
    return await this.testModel
      .find({
        $text: { $search: query, $caseSensitive: false },
      })
      .exec();
  }

  async delete(id: string): Promise<string | null> {
    return await this.testModel.findByIdAndDelete(id);
  }

  async updateById(id: string, dto: CreateTestDto): Promise<Test | null> {
    return await this.testModel.findByIdAndUpdate(id, dto, { new: true });
  }
}
