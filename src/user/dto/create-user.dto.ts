import { IsEmail, IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsInt()
  age!: number;

  @IsEmail()
  email!: string;
}
