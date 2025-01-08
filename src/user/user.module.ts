import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModel, UserSchema } from './schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('databaseUri'),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
