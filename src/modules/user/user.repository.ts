import { Injectable } from '@nestjs/common';
import type { Prisma, User } from '@prisma/client';

import { PrismaService } from '@infrastructure/prisma';
import { RedisService } from '@infrastructure/redis';

export const DEFAULT_USER_SELECT: Prisma.UserSelect = {
    id: true,
    createdAt: true,
    updatedAt: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    avatarPath: true,
    description: true,
    password: false,
} as const;

@Injectable()
export class UserRepository {
    private readonly CACHE_USER_KEY = 'user';
    private readonly CACHE_USER_TL = 3600;

    constructor(
        private readonly prisma: PrismaService,
        private readonly redisService: RedisService,
    ) {}

    async findOne(
        where: Prisma.UserWhereUniqueInput,
        select: Prisma.UserSelect = DEFAULT_USER_SELECT,
    ): Promise<User | null> {
        const cacheKey = where.id
            ? `${this.CACHE_USER_KEY}:${where.id}`
            : `${this.CACHE_USER_KEY}:${where.email}`;

        const cachedUser = await this.redisService.get(cacheKey);
        if (cachedUser) return JSON.parse(cachedUser);

        const user = await this.prisma.user.findUnique({ where, select });
        if (user)
            await this.redisService.setex(
                cacheKey,
                this.CACHE_USER_TL,
                JSON.stringify(user),
            );

        return user;
    }

    async create(
        data: Prisma.UserCreateInput,
        select: Prisma.UserSelect = DEFAULT_USER_SELECT,
    ): Promise<User> {
        const user = await this.prisma.user.create({ data, select });
        const cacheKey = `${this.CACHE_USER_KEY}:${user.id}`;
        await this.redisService.setex(
            cacheKey,
            this.CACHE_USER_TL,
            JSON.stringify(user),
        );

        return user;
    }

    async update(
        where: Prisma.UserWhereUniqueInput,
        data: Prisma.UserUpdateInput,
        select: Prisma.UserSelect = DEFAULT_USER_SELECT,
    ): Promise<User> {
        const user = await this.prisma.user.update({
            where,
            data,
            select,
        });

        const cacheKey = `${this.CACHE_USER_KEY}:${user.id}`;
        await this.redisService.del(cacheKey);
        await this.redisService.setex(
            cacheKey,
            this.CACHE_USER_TL,
            JSON.stringify(user),
        );

        return user;
    }
}
