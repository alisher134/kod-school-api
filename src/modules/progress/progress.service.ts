import { Injectable, NotFoundException } from '@nestjs/common';

import { User, UserProgress } from '@prisma/generated';

import { PrismaService } from '@infrastructure/prisma';

import { CreateProgressDto } from './dto/create-progress.dto';

@Injectable()
export class ProgressService {
    constructor(private readonly prismaService: PrismaService) {}

    async getCourseProgress(user: User, courseId: string) {
        const lessons = await this.prismaService.lesson.findMany({
            where: {
                courseId,
            },
            select: {
                id: true,
                position: true,
                slug: true,
            },
        });

        const lessonIds = lessons.map((lesson) => lesson.id);

        const completedLessons = await this.prismaService.userProgress.findMany(
            {
                where: {
                    isCompleted: true,
                    userId: user.id,
                    lessonId: {
                        in: lessonIds,
                    },
                },
            },
        );

        const completedLessonIds = new Set(
            completedLessons.map((p) => p.lessonId),
        );

        const validCompletedLessonsCount = completedLessonIds.size;

        const progressPercentage =
            (validCompletedLessonsCount / lessonIds.length) * 100;

        const nextLesson = lessons.find(
            (lesson) => !completedLessonIds.has(lesson.id),
        );

        return {
            progress: Math.round(progressPercentage),
            nextLesson: nextLesson ? nextLesson.slug : null,
        };
    }

    async create(user: User, createProgressDto: CreateProgressDto) {
        const lesson = await this.prismaService.lesson.findUnique({
            where: {
                id: createProgressDto.lessonId,
            },
            include: {
                course: true,
            },
        });

        if (!lesson) throw new NotFoundException('Lesson not found');

        const existingProgress =
            await this.prismaService.userProgress.findFirst({
                where: {
                    userId: user.id,
                    lessonId: lesson.id,
                },
            });

        let userProgress: UserProgress;

        if (existingProgress) {
            userProgress = await this.prismaService.userProgress.update({
                where: {
                    userId_lessonId: {
                        userId: user.id,
                        lessonId: lesson.id,
                    },
                },
                data: { isCompleted: createProgressDto.isCompleted },
            });
        } else {
            userProgress = await this.prismaService.userProgress.create({
                data: {
                    userId: user.id,
                    lessonId: lesson.id,
                    isCompleted: createProgressDto.isCompleted,
                },
            });
        }

        const nextLesson = await this.prismaService.lesson.findFirst({
            where: {
                courseId: lesson.courseId,
                position: {
                    gt: lesson.position,
                },
            },
            orderBy: {
                position: 'asc',
            },
        });

        return {
            nextLesson: nextLesson ? nextLesson.slug : null,
            isCompleted: userProgress.isCompleted,
        };
    }
}
