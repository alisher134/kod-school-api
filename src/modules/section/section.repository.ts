import { Injectable } from '@nestjs/common';

import type { Prisma, Section } from '@prisma/generated';

import { PrismaService } from '@infrastructure/prisma';

@Injectable()
export class SectionRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findMany(args: Prisma.SectionFindManyArgs = {}): Promise<Section[]> {
        return this.prismaService.section.findMany({
            ...args,
            orderBy: args.orderBy ?? { createdAt: 'desc' },
        });
    }

    async findOne(
        where: Prisma.SectionWhereUniqueInput,
    ): Promise<Section | null> {
        return this.prismaService.section.findUnique({
            where,
            include: { course: true },
        });
    }

    async create(data: Prisma.SectionCreateInput): Promise<Section> {
        return this.prismaService.section.create({ data });
    }

    async update(
        where: Prisma.SectionWhereUniqueInput,
        data: Prisma.SectionUpdateInput,
    ): Promise<Section> {
        return this.prismaService.section.update({ where, data });
    }

    async delete(where: Prisma.SectionWhereUniqueInput): Promise<Section> {
        return this.prismaService.section.delete({ where });
    }
}
