import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma, User } from '@prisma/client';

import { translate } from '@infrastructure/i18n';

import { RegisterDto } from '@modules/auth/dto/register.dto';
import { HashService } from '@modules/hash';

import { UpdateUserDto } from './dto/update-user.dto';
import type { IUserProfile } from './user.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashService: HashService,
    ) {}

    async getProfile(userId: string): Promise<IUserProfile> {
        const user = await this.findById(userId);
        return { profile: user };
    }

    async findByEmail(
        email: string,
        select?: Prisma.UserSelect,
    ): Promise<User | null> {
        return this.userRepository.findOne({ email }, select);
    }

    async findById(userId: string, select?: Prisma.UserSelect): Promise<User> {
        const user = await this.userRepository.findOne({ id: userId }, select);

        if (!user) throw new NotFoundException(translate('exception.notFound'));

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

    async update(updateDto: UpdateUserDto, userId: string): Promise<User> {
        await this.findById(userId, { id: true });

        const userData: Prisma.UserUpdateInput = {
            ...updateDto,
        };

        return this.userRepository.update({ id: userId }, userData);
    }
}
