import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TestDocument = HydratedDocument<Test>;

@Schema()
export class Test {
  @Prop({ required: [true, 'Section is required'] })
  category: string;

  @Prop({ required: [true, 'Section is required'] })
  question: string;

  @Prop({ required: [true, 'Section is required'], type: () => [String] })
  answers: string[];
}

const TestSchema = SchemaFactory.createForClass(Test);

export { TestSchema };
