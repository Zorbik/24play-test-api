import { IsString, ArrayNotEmpty, ArrayMinSize } from 'class-validator';

export class CreateTestDto {
  @IsString()
  category: string;

  @IsString()
  question: string;

  @ArrayNotEmpty()
  @ArrayMinSize(2)
  @IsString({ each: true })
  answers: string[];
}
