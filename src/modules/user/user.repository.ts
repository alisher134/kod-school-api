import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@infrastructure/prisma';

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
    constructor(private readonly prismaService: PrismaService) {}

    async findOne(
        where: Prisma.UserWhereUniqueInput,
        select: Prisma.UserSelect = DEFAULT_USER_SELECT,
    ) {
        return this.prismaService.user.findUnique({ where, select });
    }

    async create(
        data: Prisma.UserCreateInput,
        select: Prisma.UserSelect = DEFAULT_USER_SELECT,
    ) {
        return this.prismaService.user.create({ data, select });
    }

    async update(
        where: Prisma.UserWhereUniqueInput,
        data: Prisma.UserUpdateInput,
        select: Prisma.UserSelect = DEFAULT_USER_SELECT,
    ) {
        return this.prismaService.user.update({
            where,
            data,
            select,
        });
    }
}
