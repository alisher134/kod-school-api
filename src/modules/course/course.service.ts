import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '@prisma/generated';

import { generateSlug } from '@common/utils';

import { PrismaService } from '@infrastructure/prisma';
import { RedisService } from '@infrastructure/redis';

import { PaginationService } from '@modules/pagination/pagination.service';

import { CreateCourseDto } from './dto/create-course.dto';
import { FilterCourseDto } from './dto/filter-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
    constructor(
        private readonly prismaService: PrismaService,
        private paginationService: PaginationService,
        private readonly redisService: RedisService,
    ) {}

    async searchCourses(dto: FilterCourseDto = {}) {
        const searchTermQuery = dto.searchTerm
            ? this.getSearchTermFilter(dto.searchTerm)
            : {};

        const { perPage, skip } = this.paginationService.getPagination(dto);

        const courses = await this.prismaService.course.findMany({
            where: searchTermQuery,
            skip,
            take: perPage,
        });

        return {
            courses,
            length: await this.prismaService.course.count({
                where: searchTermQuery,
            }),
        };
    }

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
        return this.prismaService.course.findMany({
            where: {
                views: {
                    gt: 50,
                },
            },
            include: {
                lessons: true,
            },
        });
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

    private getSearchTermFilter(searchTerm: string): Prisma.CourseWhereInput {
        return {
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    slug: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
            ],
        };
    }
}
