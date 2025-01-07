import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AuthType } from 'src/_typings/auth-providers/auth.types';

export type UserDocument = HydratedDocument<UserModel>;

@Schema()
export class UserModel {
  private static readonly DEFAULT_USER_PICTURE_URL =
    'https://www.svgrepo.com/show/141833/user-placeholder.svg';
  private static readonly DEFAULT_USER_NAME = 'Unknown User';
  // won't be required in case of github auth
  // second approach - put placeholder here id+login@users.noreply.github.com
  @Prop()
  email: string;

  @Prop({})
  idFromProvider?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String })
  provider: Extract<AuthType, 'jwt'>;

  @Prop({
    default: UserModel.DEFAULT_USER_PICTURE_URL,
  })
  picture?: string;

  @Prop({
    default: UserModel.DEFAULT_USER_NAME,
  })
  name?: string;
}

const UserSchema = SchemaFactory.createForClass(UserModel);

export { UserSchema };
