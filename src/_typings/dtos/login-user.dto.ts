import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { AuthType, authTypes } from '../auth-providers/auth.types';

const stringifiedNumberRegex = /^\d+$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(passwordRegex, {
    message:
      'Password should have length of 8, and contains some latin letters and numbers',
  })
  password: string;

  @IsEnum(authTypes, {
    message: 'Provider is not in appropriate type',
  })
  provider: AuthType;

  @IsString({
    message: 'Id is not in appropriate shape',
  })
  @Matches(stringifiedNumberRegex)
  @IsOptional()
  idFromProvider?: string;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
