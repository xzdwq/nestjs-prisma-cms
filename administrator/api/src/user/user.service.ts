import * as argon from 'argon2';

import { CreateUserDto } from '@/user/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { User as UserModel } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(): Promise<UserModel[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<UserModel> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<UserModel> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  public async createUser(params: CreateUserDto): Promise<UserModel> {
    const { email, firstName, lastName, password, role } = params;

    return await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password,
        role,
      },
    });
  }

  public async updateUser(id: string, params: UpdateUserDto): Promise<UserModel> {
    return await this.prisma.user.update({
      where: { id },
      data: { ...params },
    });
  }

  public async deleteUser(id: string): Promise<UserModel> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  public async getUserIfRefreshTokenMatches(refreshToken: string, userId: string): Promise<UserModel | undefined> {
    const user = await this.findOne(userId);
    const isRefreshTokenMatching = await argon.verify(user.refreshToken, refreshToken);

    if (isRefreshTokenMatching) return user;
  }
}
