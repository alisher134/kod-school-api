import { Injectable, NotFoundException } from '@nestjs/common';

import { Direction, Prisma } from '@prisma/generated';

import { generateSlug } from '@common/utils';

import { DirectionRepository } from './direction.repository';
import { UpdateDirectionDto } from './dto';

type TDirectionField = keyof Pick<Direction, 'id' | 'slug'>;

@Injectable()
export class DirectionService {
    constructor(private readonly directionRepository: DirectionRepository) {}

    async getAll() {
        return this.directionRepository.findMany();
    }

    async getById(directionId: string): Promise<Direction> {
        return this.getByField('id', directionId);
    }

    async getBySlug(directionSlug: string): Promise<Direction> {
        return this.getByField('slug', directionSlug);
    }

    async create(): Promise<{ id: string }> {
        const directionData: Prisma.DirectionCreateInput = {
            name: '',
            slug: '',
        };

        const direction = await this.directionRepository.create(directionData);

        return { id: direction.id };
    }

    async update(directionId: string, directionDto: UpdateDirectionDto) {
        await this.getById(directionId);

        const directionData: Prisma.DirectionUpdateInput = {
            name: directionDto.name,
            slug: generateSlug(directionDto.name),
        };

        return this.directionRepository.update(
            { id: directionId },
            directionData,
        );
    }

    async delete(directionId: string): Promise<Direction> {
        await this.getById(directionId);

        return this.directionRepository.delete({ id: directionId });
    }

    private async getByField(
        field: TDirectionField,
        value: string,
    ): Promise<Direction> {
        const where = field === 'id' ? { id: value } : { slug: value };

        const direction = await this.directionRepository.findOne(where);
        if (!direction) throw new NotFoundException('Direction not found!');

        return direction;
    }
}
