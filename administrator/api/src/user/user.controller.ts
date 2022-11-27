import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Version } from '@nestjs/common';

import { User as UserModel } from '@prisma/client';
import { UserService } from '@/user/user.service';
import { UserDto } from '@/user/dto/user.dto';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

@ApiTags('User')
// @ApiSecurity("X-API-KEY", ["X-API-KEY"])
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    type: UserDto,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<UserModel[]> {
    return await this.userService.findAll();
  }

  @Version('1')
  @ApiOperation({ summary: 'Get one user by id' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserModel> {
    return await this.userService.findOne(id);
  }

  @Version('1')
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    description: 'JSON property parameters',
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    status: 200,
    type: UserDto,
  })
  @Post()
  async createUser(@Body() params: CreateUserDto): Promise<UserModel> {
    return await this.userService.createUser(params);
  }

  @Version('1')
  @ApiOperation({ summary: 'Update one user by id' })
  @ApiBody({
    description: 'JSON property parameters',
    type: UpdateUserDto,
  })
  @ApiCreatedResponse({
    status: 200,
    type: UserDto,
  })
  @Patch(':id')
  async updateUser(@Param('id', new ParseUUIDPipe()) id: string, @Body() params: UpdateUserDto): Promise<UserModel> {
    return await this.userService.updateUser(id, params);
  }

  @Version('1')
  @ApiOperation({ summary: 'Delete one user by id' })
  @ApiCreatedResponse({
    status: 200,
    type: UserDto,
  })
  @Delete(':id')
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserModel> {
    return await this.userService.deleteUser(id);
  }
}
