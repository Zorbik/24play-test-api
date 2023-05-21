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
import { ValidationPipe } from '@nestjs/common';

import { TestService } from './test.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateTestDto } from './dto/create-test.dto';
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
    return await this.testService.getTest(category);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return await this.testService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTestDto,
  ) {
    return await this.testService.updateById(id, dto);
  }

  @Get('search')
  async search(@Query('query') query: string): Promise<CreateTestDto[]> {
    return await this.testService.search(query);
  }
}
