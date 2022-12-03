import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Version } from '@nestjs/common';

import { User as UserModel } from '@prisma/client';
import { UserService } from '@/user/user.service';
import { UserDto } from '@/user/dto/user.dto';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

@ApiTags('User')
@ApiCookieAuth()
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
  public async findAll(): Promise<UserModel[]> {
    return await this.userService.findAll();
  }

  @Version('1')
  @ApiOperation({ summary: 'Get one user by id' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @Get(':id')
  public async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserModel> {
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
  public async createUser(@Body() params: CreateUserDto): Promise<UserModel> {
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
  public async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() params: UpdateUserDto,
  ): Promise<UserModel> {
    return await this.userService.updateUser(id, params);
  }

  @Version('1')
  @ApiOperation({ summary: 'Delete one user by id' })
  @ApiCreatedResponse({
    status: 200,
    type: UserDto,
  })
  @Delete(':id')
  public async deleteUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserModel> {
    return await this.userService.deleteUser(id);
  }
}
