import { Injectable } from '@nestjs/common/decorators';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.model';
import {
  ALREADY_REGISTERED_ERROR,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from './auth.constans';
import { SignInDto } from './dto/signin.dto';
import { Statistic } from './dto/quiz.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const isUser = await this.findUser(dto.email);

    if (isUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }

    const createDate = new Date();
    const salt = await genSalt(10);

    const token = await this.jwtService.signAsync({ email: dto.email });

    const response = await this.userModel.create({
      ...dto,
      password: await hash(dto.password, salt),
      token: token,
      role: 'guest',
      createdAt: createDate,
      updatedAt: createDate,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __v, password, ...user } = response.toObject();

    return user;
  }

  async signinUser(dto: SignInDto) {
    const email = await this.validateUser(dto.email, dto.password);

    const user = await this.userModel
      .findOne({ email }, { __v: 0, password: 0 })
      .exec();

    const token = await this.jwtService.signAsync({ email });

    user.token = token;
    user.save();

    return user;
  }

  async updateUser(id: string, dto: Statistic) {
    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $push: { statistics: dto },
          updatedAt: new Date(),
        },
        { new: true },
      )
      .select('-__v -password')
      .exec();
  }

  async logOutUser(id: string) {
    const user = await this.userModel.findById({ _id: id }).exec();
    user.token = '';
    user.save();
  }

  async getStatistic() {
    return await this.userModel.find();
  }

  async deleteUser(id: string) {
    await this.userModel.findByIdAndRemove({ _id: id }).exec();
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    return email;
  }

  async findUser(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }
}
