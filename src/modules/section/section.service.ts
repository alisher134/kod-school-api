import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, Section } from '@prisma/generated';

import { generateSlug } from '@common/utils';

import { CreateSectionDto, UpdateSectionDto } from './dto';
import { SectionRepository } from './section.repository';

type TSectionField = 'id' | 'slug';

@Injectable()
export class SectionService {
    constructor(private readonly sectionRepository: SectionRepository) {}

    async getAll() {
        return this.sectionRepository.findMany();
    }

    async getById(sectionId: string): Promise<Section> {
        return this.getByField('id', sectionId);
    }

    async getBySlug(sectionSlug: string): Promise<Section> {
        return this.getByField('slug', sectionSlug);
    }

    async create(createSectionDto: CreateSectionDto): Promise<{ id: string }> {
        const sectionData: Prisma.SectionCreateInput = {
            name: '',
            slug: '',
            course: {
                connect: {
                    id: createSectionDto.courseId,
                },
            },
        };

        const section = await this.sectionRepository.create(sectionData);

        return { id: section.id };
    }

    async update(sectionId: string, updateSectionDto: UpdateSectionDto) {
        await this.getById(sectionId);

        const sectionData: Prisma.SectionUpdateInput = {
            name: updateSectionDto.name,
            slug: generateSlug(updateSectionDto.name),
            course: {
                connect: {
                    id: updateSectionDto.courseId,
                },
            },
        };

        return this.sectionRepository.update({ id: sectionId }, sectionData);
    }

    async delete(sectionId: string): Promise<Section> {
        await this.getById(sectionId);

        return this.sectionRepository.delete({ id: sectionId });
    }

    private async getByField(
        field: TSectionField,
        value: string,
    ): Promise<Section> {
        const where = field === 'id' ? { id: value } : { slug: value };

        const section = await this.sectionRepository.findOne(where);
        if (!section) throw new NotFoundException('Section not found!');

        return section;
    }
}
