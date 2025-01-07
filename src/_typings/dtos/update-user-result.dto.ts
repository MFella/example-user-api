import { LoginUserResultDto } from './login-user-result.dto';

export type UpdateUserResultDto = Omit<LoginUserResultDto, 'accessToken'>;
