import { Injectable } from '@nestjs/common';

import type { Course, Prisma } from '@prisma/generated';

import { PrismaService } from '@infrastructure/prisma';

@Injectable()
export class CourseRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findMany(args: Prisma.CourseFindManyArgs = {}): Promise<Course[]> {
        return this.prismaService.course.findMany({
            ...args,
            include: args.include ?? { directions: true },
            orderBy: args.orderBy ?? { createdAt: 'desc' },
        });
    }

    async findOne(
        where: Prisma.CourseWhereUniqueInput,
    ): Promise<Course | null> {
        return this.prismaService.course.findUnique({
            where,
            include: { directions: true, sections: true },
        });
    }

    async create(data: Prisma.CourseCreateInput): Promise<Course> {
        return this.prismaService.course.create({ data });
    }

    async update(
        where: Prisma.CourseWhereUniqueInput,
        data: Prisma.CourseUpdateInput,
    ): Promise<Course> {
        return this.prismaService.course.update({ where, data });
    }

    async delete(where: Prisma.CourseWhereUniqueInput): Promise<Course> {
        return this.prismaService.course.delete({ where });
    }
}
