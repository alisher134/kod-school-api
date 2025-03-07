import { Injectable } from '@nestjs/common';

import { Direction, Prisma } from '@prisma/generated';

import { PrismaService } from '@infrastructure/prisma';

@Injectable()
export class DirectionRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findMany(
        args: Prisma.DirectionFindManyArgs = {},
    ): Promise<Direction[]> {
        return this.prismaService.direction.findMany({
            ...args,
            orderBy: args.orderBy ?? { createdAt: 'desc' },
        });
    }

    async findOne(
        where: Prisma.DirectionWhereUniqueInput,
    ): Promise<Direction | null> {
        return this.prismaService.direction.findUnique({ where });
    }

    async create(data: Prisma.DirectionCreateInput): Promise<Direction> {
        return this.prismaService.direction.create({ data });
    }

    async update(
        where: Prisma.DirectionWhereUniqueInput,
        data: Prisma.DirectionUpdateInput,
    ): Promise<Direction> {
        return this.prismaService.direction.update({ where, data });
    }

    async delete(where: Prisma.DirectionWhereUniqueInput): Promise<Direction> {
        return this.prismaService.direction.delete({ where });
    }
}
