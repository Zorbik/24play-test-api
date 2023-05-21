import { IsString, Length, IsEmail } from 'class-validator';
import { Statistic } from './quiz.dto';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @Length(7, 30)
  @IsString()
  password: string;

  statistics: Statistic[];
}
