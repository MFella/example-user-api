import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { passwordRegex } from './login-user.dto';

const MIN_USER_LENGTH = 4;
const MAX_USER_LENGTH = 32;

export class UpdateUserDto {
  @IsString()
  @MinLength(MIN_USER_LENGTH, {
    message: `Min user length is ${MIN_USER_LENGTH}`,
  })
  @MaxLength(MAX_USER_LENGTH, {
    message: `Max user length is ${MAX_USER_LENGTH}`,
  })
  @IsOptional()
  name: string;

  @IsString()
  @Matches(passwordRegex, {
    message: 'Password should have length of 8',
  })
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  picture: string;
}
