import { ERole, User as UserModel } from '@prisma/client';

import { CreateUserDto } from '@/user/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserModel[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<UserModel> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(params: CreateUserDto): Promise<UserModel> {
    const { email, firstName, lastName, password, role = ERole.WRITER } = params;

    return await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password,
        role,
      },
    })
  }

  async updateUser(id: string, params: UpdateUserDto): Promise<UserModel> {
    return await this.prisma.user.update({
      where: { id },
      data: { ...params }
    });
  }

  async deleteUser(id: string): Promise<UserModel> {
    return await this.prisma.user.delete({
      where: { id }
    });
  }
}
