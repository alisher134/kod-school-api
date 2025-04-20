import { Injectable, NotFoundException } from '@nestjs/common';

import { generateSlug } from '@common/utils';

import { PrismaService } from '@infrastructure/prisma';
import { RedisService } from '@infrastructure/redis';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
    ) {}

    async getAll() {
        const courses = await this.prismaService.course.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                lessons: true,
            },
        });

        return courses;
    }

    async getPopular() {
        const courses = await this.prismaService.course.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                lessons: true,
            },
            take: 4,
        });

        return courses;
    }

    async getBySlug(slug: string) {
        const cachedCourse = await this.redisService.get(`courses:${slug}`);

        if (cachedCourse) return JSON.parse(cachedCourse);

        const course = await this.prismaService.course.findUnique({
            where: {
                slug,
            },
        });

        if (!course) throw new NotFoundException('Course not found');

        await this.redisService.setex(
            `courses:${course.slug}`,
            10 * 60,
            JSON.stringify(course),
        );

        return course;
    }

    async getCourseLessons(id: string) {
        const course = await this.prismaService.course.findUnique({
            where: {
                id,
            },
        });

        if (!course) throw new NotFoundException('Course not found');

        const lessons = await this.prismaService.lesson.findMany({
            where: {
                courseId: course.id,
            },
            orderBy: {
                position: 'asc',
            },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                position: true,
                userProgress: {
                    select: {
                        isCompleted: true,
                    },
                },
            },
        });

        return lessons;
    }

    async incrementViews(id: string) {
        await this.prismaService.course.update({
            where: {
                id,
            },
            data: {
                views: {
                    increment: 1,
                },
            },
        });

        return true;
    }

    async update(id: string, updateCourseDto: UpdateCourseDto) {
        const course = await this.prismaService.course.update({
            where: {
                id,
            },
            data: {
                title: updateCourseDto.title,
                slug: generateSlug(updateCourseDto.title),
                description: updateCourseDto.description,
                thumbnail: updateCourseDto.thumbnail,
            },
        });

        return { id: course.id };
    }

    async create(createCourseDto: CreateCourseDto) {
        const course = await this.prismaService.course.create({
            data: {
                title: createCourseDto.title,
                slug: generateSlug(createCourseDto.title),
            },
        });

        return { id: course.id };
    }
}
