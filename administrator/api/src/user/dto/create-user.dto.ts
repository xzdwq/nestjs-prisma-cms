import { PickType } from '@nestjs/swagger';
import { UserDto } from '@/user/dto/user.dto';

export class CreateUserDto extends PickType(UserDto, ['email', 'firstName', 'lastName', 'password', 'role'] as const) {}
