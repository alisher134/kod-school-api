import { Injectable, NotFoundException } from '@nestjs/common';

import type { Course, Prisma } from '@prisma/generated';

import { generateSlug } from '@common/utils';

import { CourseRepository } from './course.repository';
import { UpdateCourseDto } from './dto';

type TCourseField = 'id' | 'slug';

@Injectable()
export class CourseService {
    constructor(private readonly courseRepository: CourseRepository) {}

    async getAll() {
        return this.courseRepository.findMany();
    }

    async getById(courseId: string): Promise<Course> {
        return this.getByField('id', courseId);
    }

    async getBySlug(courseSlug: string): Promise<Course> {
        return this.getByField('slug', courseSlug);
    }

    async create(): Promise<{ id: string }> {
        const courseData: Prisma.CourseCreateInput = {
            title: '',
            slug: '',
            subTitle: '',
            description: '',
            thumbnail: '',
            techs: [],
            requirements: [],
        };

        const course = await this.courseRepository.create(courseData);

        return { id: course.id };
    }

    async update(courseId: string, courseDto: UpdateCourseDto) {
        await this.getById(courseId);

        const courseData: Prisma.CourseUpdateInput = {
            title: courseDto.title,
            slug: generateSlug(courseDto.title),
            subTitle: courseDto.subTitle,
            thumbnail: courseDto.thumbnail,
            description: courseDto.description,
            requirements: courseDto.requirements,
            techs: courseDto.techs,
            directions: {
                set: courseDto.directionIds.map((directionId) => ({
                    id: directionId,
                })),
            },
        };

        return this.courseRepository.update({ id: courseId }, courseData);
    }

    async delete(courseId: string): Promise<Course> {
        await this.getById(courseId);

        return this.courseRepository.delete({ id: courseId });
    }

    private async getByField(
        field: TCourseField,
        value: string,
    ): Promise<Course> {
        const where = field === 'id' ? { id: value } : { slug: value };

        const course = await this.courseRepository.findOne(where);
        if (!course) throw new NotFoundException('Course not found!');

        return course;
    }
}
