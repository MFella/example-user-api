import { IsEmail, IsEnum, IsString } from 'class-validator';
import { AuthType, authTypes } from '../auth-providers/auth.types';

export class LoginUserResultDto {
  @IsEnum(authTypes)
  provider: AuthType;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  picture: string;

  @IsString()
  accessToken?: string;
}
