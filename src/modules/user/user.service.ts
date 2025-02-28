import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { RegisterDto } from '@modules/auth/dto/register.dto';
import { HashService } from '@modules/hash';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashService: HashService,
    ) {}

    async findByEmail(
        email: string,
        select?: Prisma.UserSelect,
    ): Promise<User | null> {
        return this.userRepository.findOne({ email }, select);
    }

    async findById(userId: string, select?: Prisma.UserSelect): Promise<User> {
        const user = await this.userRepository.findOne({ id: userId }, select);

        if (!user) throw new NotFoundException('User not found!');

        return user;
    }

    async create(registerDto: RegisterDto): Promise<User> {
        const hashPassword = await this.hashService.hashPassword(
            registerDto.password,
        );

        const userData: Prisma.UserCreateInput = {
            ...registerDto,
            password: hashPassword,
        };

        return this.userRepository.create(userData);
    }
}
