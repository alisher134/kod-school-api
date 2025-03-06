import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, User } from '@prisma/generated';

import { translate } from '@infrastructure/i18n';

import { RegisterDto } from '@modules/auth';
import { HashService } from '@modules/hash';

import { UpdateUserDto } from './dto';
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
        return { profile: this.omitPassword(user) };
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ email });
    }

    async findById(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({ id: userId });
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

    async update(
        updateDto: UpdateUserDto,
        userId: string,
    ): Promise<Omit<User, 'password'>> {
        await this.findById(userId);

        const userData: Prisma.UserUpdateInput = {
            ...updateDto,
        };

        const user = await this.userRepository.update({ id: userId }, userData);
        return this.omitPassword(user);
    }

    private omitPassword(user: User): Omit<User, 'password'> {
        const { password, ...restUser } = user;
        return restUser;
    }
}
