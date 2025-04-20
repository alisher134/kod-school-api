import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, User } from '@prisma/generated';

import { translate } from '@infrastructure/i18n';
import { PrismaService } from '@infrastructure/prisma';

import { RegisterDto } from '@modules/auth';
import { HashService } from '@modules/hash';

import { UpdateUserDto } from './dto';
import type { ILastLesson, IUserProfile } from './user.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userRepository: UserRepository,
        private readonly hashService: HashService,
    ) {}

    async getProfile(userId: string): Promise<IUserProfile> {
        const user = await this.findById(userId);
        return { profile: user };
    }

    async getMeProgress(user: User) {
        const courses = await this.prismaService.course.findMany({
            include: {
                lessons: {
                    select: {
                        id: true,
                        title: true,
                        position: true,
                        courseId: true,
                    },
                },
            },
        });

        const userProgress = await this.prismaService.userProgress.findMany({
            where: {
                userId: user.id,
            },
            select: {
                lessonId: true,
                createdAt: true,
                lesson: {
                    select: {
                        courseId: true,
                        slug: true,
                        position: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const lastAccessMap = new Map<string, Date>();
        const lastLessonMap = new Map<string, ILastLesson>();

        for (const record of userProgress) {
            const courseId = record.lesson.courseId;

            lastAccessMap.set(courseId, record.createdAt);

            if (!lastLessonMap.has(courseId)) {
                lastLessonMap.set(courseId, {
                    id: record.lessonId,
                    slug: record.lesson.slug,
                    position: record.lesson.position,
                });
            }
        }

        const result = courses
            .map((course) => {
                const totalLessons = course.lessons.length;
                const completedLessons = course.lessons.filter((lesson) =>
                    userProgress.some(
                        (progress) => progress.lessonId === lesson.id,
                    ),
                ).length;

                const progress =
                    totalLessons > 0
                        ? Math.round((completedLessons / totalLessons) * 100)
                        : 0;

                const allLessonsCompleted = completedLessons === totalLessons;

                return {
                    id: course.id,
                    title: course.title,
                    thumbnail: course.thumbnail,
                    totalLessons,
                    completedLessons,
                    progress,
                    lastAccessed: lastAccessMap.get(course.id)
                        ? lastAccessMap.get(course.id).toISOString()
                        : null,
                    lastLesson: allLessonsCompleted
                        ? null
                        : lastLessonMap.get(course.id) || null,
                };
            })
            .filter((course) => course.completedLessons > 0);

        return result.sort((a, b) => {
            if (a.lastAccessed && b.lastAccessed) {
                return (
                    new Date(b.lastAccessed).getTime() -
                    new Date(a.lastAccessed).getTime()
                );
            }
            return 0;
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ email });
    }

    async findById(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({ id: userId });
        if (!user) throw new NotFoundException(translate('exception.notFound'));

        return user;
    }

    async create(registerDto: RegisterDto): Promise<User> {
        const hashPassword = await this.hashService.hashPassword(
            registerDto.password,
        );

        const userData: Prisma.UserCreateInput = {
            ...registerDto,
            password: hashPassword,
        };

        return this.userRepository.create(userData);
    }

    async update(
        updateDto: UpdateUserDto,
        userId: string,
    ): Promise<Omit<User, 'password'>> {
        await this.findById(userId);

        const userData: Prisma.UserUpdateInput = {
            ...updateDto,
        };

        const user = await this.userRepository.update({ id: userId }, userData);
        return this.omitPassword(user);
    }

    private omitPassword(user: User): Omit<User, 'password'> {
        const { password, ...restUser } = user;
        return restUser;
    }
}
