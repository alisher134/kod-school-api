import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '@prisma/generated';

import { generateSlug } from '@common/utils';

import { PrismaService } from '@infrastructure/prisma';

import { CreateLessonDto, UpdateLessonDto } from './dto';

@Injectable()
export class LessonService {
    constructor(private prismaService: PrismaService) {}

    async getBySlug(slug: string) {
        const lesson = await this.prismaService.lesson.findUnique({
            where: {
                slug,
            },
            include: {
                course: true,
                userProgress: {
                    select: {
                        isCompleted: true,
                    },
                },
            },
        });

        if (!lesson) throw new NotFoundException('Lesson not found');

        return lesson;
    }

    async getCompletedLessons(user: User, courseId: string) {
        const lessons = await this.prismaService.lesson.findMany({
            where: { courseId },
            select: { id: true },
        });

        const totalLessons = lessons.length;

        const lessonIds = lessons.map((lesson) => lesson.id);

        const completedLessons = await this.prismaService.userProgress.findMany(
            {
                where: {
                    userId: user.id,
                    lessonId: { in: lessonIds },
                    isCompleted: true,
                },
                select: { lessonId: true },
            },
        );

        const completedLessonIds = completedLessons.map(
            (lessonProgress) => lessonProgress.lessonId,
        );
        const completedLessonsCount = completedLessonIds.length;

        const progress =
            totalLessons > 0
                ? Math.round((completedLessonsCount / totalLessons) * 100)
                : 0;

        return {
            totalLessons,
            completedLessons: completedLessonsCount,
            progress,
        };
    }

    async update(id: string, updateLessonDto: UpdateLessonDto) {
        const course = await this.prismaService.course.findUnique({
            where: {
                id: updateLessonDto.courseId,
            },
        });

        if (!course) throw new NotFoundException('Course not found');

        const lesson = await this.prismaService.lesson.update({
            where: {
                id,
            },
            data: {
                title: updateLessonDto.title,
                slug: generateSlug(updateLessonDto.title),
                description: updateLessonDto.description,
                lessonUrl: updateLessonDto.lessonUrl,
                course: {
                    connect: {
                        id: course.id,
                    },
                },
            },
        });

        return { id: lesson.id };
    }

    async create(createLessonDto: CreateLessonDto) {
        const course = await this.prismaService.course.findUnique({
            where: {
                id: createLessonDto.courseId,
            },
        });

        if (!course) throw new NotFoundException('Course not found');

        const lastLesson = await this.prismaService.lesson.findFirst({
            where: {
                courseId: course.id,
            },
            orderBy: {
                position: 'desc',
            },
        });

        const newPosition = lastLesson ? lastLesson.position + 1 : 1;

        const lesson = await this.prismaService.lesson.create({
            data: {
                title: createLessonDto.title,
                slug: generateSlug(createLessonDto.title),
                position: newPosition,
                course: {
                    connect: {
                        id: course.id,
                    },
                },
            },
        });

        return { id: lesson.id };
    }
}
