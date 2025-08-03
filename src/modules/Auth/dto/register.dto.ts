import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @Length(2, 40)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6)
  password: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @Length(10)
  address: string;
}
