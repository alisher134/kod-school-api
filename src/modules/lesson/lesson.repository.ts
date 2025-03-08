import { Injectable } from '@nestjs/common';

import type { Lesson, Prisma } from '@prisma/generated';

import { PrismaService } from '@infrastructure/prisma';

@Injectable()
export class LessonRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findMany(args: Prisma.LessonFindManyArgs = {}): Promise<Lesson[]> {
        return this.prismaService.lesson.findMany({
            ...args,
            orderBy: args.orderBy ?? { createdAt: 'desc' },
        });
    }

    async findOne(
        where: Prisma.LessonWhereUniqueInput,
    ): Promise<Lesson | null> {
        return this.prismaService.lesson.findUnique({
            where,
        });
    }

    async create(data: Prisma.LessonCreateInput): Promise<Lesson> {
        return this.prismaService.lesson.create({ data });
    }

    async update(
        where: Prisma.LessonWhereUniqueInput,
        data: Prisma.LessonUpdateInput,
    ): Promise<Lesson> {
        return this.prismaService.lesson.update({ where, data });
    }

    async delete(where: Prisma.LessonWhereUniqueInput): Promise<Lesson> {
        return this.prismaService.lesson.delete({ where });
    }
}
