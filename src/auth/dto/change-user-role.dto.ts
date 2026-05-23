/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangeUserRoleDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

}
