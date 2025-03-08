import { Injectable, NotFoundException } from '@nestjs/common';

import type { Lesson, Prisma } from '@prisma/generated';

import { generateSlug } from '@common/utils';

import { CreateLessonDto, UpdateLessonDto } from './dto';
import { LessonRepository } from './lesson.repository';

type TLessonField = 'id' | 'slug';

@Injectable()
export class LessonService {
    constructor(private readonly lessonRepository: LessonRepository) {}

    async getAll() {
        return this.lessonRepository.findMany();
    }

    async getById(lessonId: string): Promise<Lesson> {
        return this.getByField('id', lessonId);
    }

    async getBySlug(lessonSlug: string): Promise<Lesson> {
        return this.getByField('slug', lessonSlug);
    }

    async create(createLessonDto: CreateLessonDto): Promise<{ id: string }> {
        const lessonData: Prisma.LessonCreateInput = {
            title: '',
            slug: '',
            videoUrl: '',
            order: 0,
            section: {
                connect: {
                    id: createLessonDto.sectionId,
                },
            },
        };

        const lesson = await this.lessonRepository.create(lessonData);

        return { id: lesson.id };
    }

    async update(lessonId: string, updateLessonDto: UpdateLessonDto) {
        await this.getById(lessonId);

        const lessonData: Prisma.LessonUpdateInput = {
            title: updateLessonDto.title,
            slug: generateSlug(updateLessonDto.title),
            videoUrl: updateLessonDto.videoUrl,
            order: updateLessonDto.order,
            section: {
                connect: {
                    id: updateLessonDto.sectionId,
                },
            },
        };

        return this.lessonRepository.update({ id: lessonId }, lessonData);
    }

    async delete(lessonId: string): Promise<Lesson> {
        await this.getById(lessonId);

        return this.lessonRepository.delete({ id: lessonId });
    }

    private async getByField(
        field: TLessonField,
        value: string,
    ): Promise<Lesson> {
        const where = field === 'id' ? { id: value } : { slug: value };

        const lesson = await this.lessonRepository.findOne(where);
        if (!lesson) throw new NotFoundException('Lesson not found!');

        return lesson;
    }
}
