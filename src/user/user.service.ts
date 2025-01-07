import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as argon from 'argon2';
import { AuthType } from '../_typings/auth-providers/auth.types';
import { TypeUtil } from '../_helpers/type.util';
import { LoginUserResultDto } from '../_typings/dtos/login-user-result.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserResultDto } from '../_typings/dtos/update-user-result.dto';
import { UpdateUserDto } from '../_typings/dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(
    provider: AuthType,
    _idFromProvider: string,
    _name: string,
    _picture: string,
    email: string,
    password: string,
  ): Promise<LoginUserResultDto> {
    // only jwt is supported at this time
    if (provider !== 'jwt') {
      throw new InternalServerErrorException(
        `Saving user from ${provider} source is not supported yet`,
      );
    }

    // if there is already user in db, do not register
    const userFromDb = await this.userModel.findOne({ email, provider });

    if (!userFromDb) {
      return await this.registerUser(password, email, provider);
    }

    const isPasswordValid = await argon.verify(
      userFromDb.passwordHash.trim(),
      password.trim(),
    );

    if (isPasswordValid) {
      const jwtPayload = {
        _id: userFromDb._id,
        email,
        provider,
      };

      return {
        email,
        provider,
        name: userFromDb.name,
        picture: userFromDb.picture,
        accessToken: await this.jwtService.signAsync(jwtPayload),
      };
    } else {
      throw new UnauthorizedException('Provided password is not valid');
    }
  }

  async updateUser(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResultDto> {
    const userFromDb = await this.userModel.findOne({ email });

    if (!userFromDb) {
      throw new InternalServerErrorException(
        'Unrecognized errror - user doesnt exist',
      );
    }

    const updateUserQuery = {};

    let pass = '';
    if (updateUserDto.password) {
      pass = updateUserDto.password;
      updateUserDto.password = await argon.hash(updateUserDto.password);
    }

    const result = await argon.verify(updateUserDto.password, pass);

    for (const [key, value] of Object.entries(updateUserDto)) {
      if (value) {
        if (key === 'password') {
          updateUserQuery['passwordHash'] = value;
          continue;
        }
        updateUserQuery[key] = value;
      }
    }

    if (!Object.keys(updateUserQuery).length) {
      throw new BadRequestException('Provided update payload is empty');
    }

    const updateUserResult = await this.userModel.findOneAndUpdate(
      {
        email,
      },
      updateUserQuery,
    );

    return {
      email: updateUserResult.email,
      provider: updateUserResult.provider,
      name: updateUserResult.name,
      picture: updateUserResult.picture,
    };
  }

  private async registerUser(
    password: string,
    email: string,
    provider: Extract<AuthType, 'jwt'>,
  ): Promise<LoginUserResultDto> {
    try {
      const passwordHash = await argon.hash(password);
      const createdUser = new this.userModel({ passwordHash, provider, email });
      const saveUserResult = await createdUser.save();
      const jwtPayload = {
        _id: saveUserResult._id,
        email: saveUserResult.email,
        provider: saveUserResult.provider,
      };

      return {
        provider: saveUserResult.provider,
        email: saveUserResult.email,
        name: saveUserResult.name,
        picture: saveUserResult.picture,
        accessToken: await this.jwtService.signAsync(jwtPayload),
      };
    } catch (error: unknown) {
      const errorMessage = TypeUtil.isErrorWithMessage(error)
        ? error.message
        : 'Unrecognized error';
      throw new InternalServerErrorException(
        'Something occured during saving of user: ' + errorMessage,
      );
    }
  }
}
