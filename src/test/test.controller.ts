import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common/decorators';
import { NotFoundException, ValidationPipe } from '@nestjs/common';

import { TestService } from './test.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateTestDto } from './dto/create-test.dto';
import {
  CATEGORY_NOT_FOUND_ERROR,
  TEST_NOT_FOUND_ERROR,
} from './test.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTestDto) {
    return await this.testService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':category')
  async get(@Param('category') category: string) {
    const array = await this.testService.getTest(category);
    if (!array.length) {
      throw new NotFoundException(CATEGORY_NOT_FOUND_ERROR);
    }
    return array;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedId = await this.testService.delete(id);
    if (!deletedId) {
      throw new NotFoundException(TEST_NOT_FOUND_ERROR);
    }
    return deletedId;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTestDto,
  ) {
    const updatedTest = await this.testService.updateById(id, dto);
    if (!updatedTest) {
      throw new NotFoundException(TEST_NOT_FOUND_ERROR);
    }
    return updatedTest;
  }

  @Get('search')
  async search(@Query('query') query: string): Promise<CreateTestDto[]> {
    return await this.testService.search(query);
  }
}
