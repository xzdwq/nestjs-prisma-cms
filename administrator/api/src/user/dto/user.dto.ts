import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

import { ApiProperty } from '@nestjs/swagger';
import { ERole } from '@prisma/client';
import { Password } from "@/common/validate/password.rules";

export class UserDto {
  @ApiProperty({ description: 'User uuid identifier', required: false })
  readonly id?: string;

  @ApiProperty({ description: 'User email' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'User first name' })
  @IsString()
  readonly firstName: string;

  @ApiProperty({ description: 'User last name' })
  @IsString()
  readonly lastName: string;

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @Password()
  readonly password: string;

  @ApiProperty({ description: 'User role', required: false })
  @IsOptional()
  @IsEnum(ERole)
  readonly role?: ERole;

  @ApiProperty({ description: 'Date created user', required: false })
  readonly createAt?: Date;

  @ApiProperty({ description: 'Date updated user', required: false })
  readonly updateAt?: Date;
}
