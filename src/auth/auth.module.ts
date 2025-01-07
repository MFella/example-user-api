import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EnvJwtConfig } from '../_typings/auth-providers/auth.types';

const DEFAULT_JWT_EXPIRES_IN_SEC = 60;

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const envJwtConfig = configService.get<EnvJwtConfig>('jwtConfig');
        return {
          global: true,
          secret: envJwtConfig.secret,
          signOptions: {
            expiresIn: `${envJwtConfig.expiresInSec ?? DEFAULT_JWT_EXPIRES_IN_SEC}s`,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
