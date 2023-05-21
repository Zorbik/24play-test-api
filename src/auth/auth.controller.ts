import { Controller, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/signin.dto';
import { Statistic } from './dto/quiz.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('signup')
  async create(@Body() dto: CreateUserDto) {
    return await this.authService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async signIn(@Body() dto: SignInDto) {
    return await this.authService.signinUser(dto);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Statistic) {
    return await this.authService.updateUser(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(id: string): Promise<any> {
    await this.authService.logOutUser(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('statistic/:category')
  async get(@Param('category') category: string) {
    return await this.authService.getStatistic(category);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    await this.authService.deleteUser(id);
  }
}
