import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

import { Password } from '@/common/validate/password.rules';
import { UserDto } from '@/user/dto/user.dto';

export class UpdateUserDto extends PickType(UserDto, [
  'email',
  'firstName',
  'lastName',
  'password',
  'refreshToken',
  'role',
] as const) {
  @ApiProperty({ description: 'User email', required: false })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ description: 'User first name', required: false })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiProperty({ description: 'User last name', required: false })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiProperty({ description: 'User password', required: false })
  @IsOptional()
  @IsString()
  @Password({ message: 'Password must contain lowercase, uppercase letters and at least one special character' })
  readonly password?: string;
}
