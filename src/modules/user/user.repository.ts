import { Injectable } from '@nestjs/common';

import { Prisma, User } from '@prisma/generated';

import { PrismaService } from '@infrastructure/prisma';
import { RedisService } from '@infrastructure/redis';

@Injectable()
export class UserRepository {
    private readonly CACHE_USER_KEY = 'user';
    private readonly CACHE_USER_TL = 3600;

    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
    ) {}

    async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
        const cacheKey = where.id
            ? `${this.CACHE_USER_KEY}:${where.id}`
            : `${this.CACHE_USER_KEY}:${where.email}`;

        const cachedUser = await this.redisService.get(cacheKey);
        if (cachedUser) return JSON.parse(cachedUser);

        const user = await this.prismaService.user.findUnique({
            where,
        });
        if (user) await this.setToCache(cacheKey, user);

        return user;
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const user = await this.prismaService.user.create({
            data,
        });
        const cacheKey = `${this.CACHE_USER_KEY}:${user.id}`;
        await this.setToCache(cacheKey, user);

        return user;
    }

    async update(
        where: Prisma.UserWhereUniqueInput,
        data: Prisma.UserUpdateInput,
    ): Promise<User> {
        const user = await this.prismaService.user.update({
            where,
            data,
        });

        const cacheKeys = [
            `${this.CACHE_USER_KEY}:${user.id}`,
            `${this.CACHE_USER_KEY}:${user.email}`,
        ];

        await Promise.all(cacheKeys.map((key) => this.redisService.del(key)));
        await Promise.all(cacheKeys.map((key) => this.setToCache(key, user)));

        return user;
    }

    private async setToCache(key: string, user: User) {
        return await this.redisService.setex(
            key,
            this.CACHE_USER_TL,
            JSON.stringify(user),
        );
    }
}
