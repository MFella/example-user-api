export type AuthType = 'google' | 'facebook' | 'github' | 'jwt';

export const authTypes: Array<AuthType> = [
  'facebook',
  'github',
  'google',
  'jwt',
];

export type EnvJwtConfig = {
  global: boolean;
  secret: string;
  expiresInSec: number;
};
