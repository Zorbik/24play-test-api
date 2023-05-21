import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoConfig = async (): Promise<MongooseModuleOptions> => ({
  uri: `mongodb+srv://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@cluster0.ems6o3h.mongodb.net/`,
});
