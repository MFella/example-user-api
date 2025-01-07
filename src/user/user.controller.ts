import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from '../_typings/dtos/login-user.dto';
import { LoginUserResultDto } from '../_typings/dtos/login-user-result.dto';
import { UpdateUserResultDto } from '../_typings/dtos/update-user-result.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from '../_typings/dtos/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginUserResultDto> {
    return await this.userService.loginUser(
      loginUserDto.provider,
      loginUserDto.idFromProvider,
      loginUserDto.name,
      loginUserDto.picture,
      loginUserDto.email,
      loginUserDto.password,
    );
  }

  @UseGuards(AuthGuard)
  @Put('')
  async updateUser(
    @Req() request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResultDto> {
    return this.userService.updateUser(request.user?.email, updateUserDto);
  }
}
