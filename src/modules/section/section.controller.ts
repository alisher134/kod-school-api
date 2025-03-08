import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
} from '@nestjs/common';

import { Section } from '@prisma/generated';

import { Auth } from '@modules/auth/decorators';

import { CreateSectionDto, UpdateSectionDto } from './dto';
import { SectionService } from './section.service';

@Controller('section')
export class SectionController {
    constructor(private readonly sectionService: SectionService) {}

    @Auth('ADMIN')
    @Get()
    @HttpCode(HttpStatus.OK)
    getAll(): Promise<Section[]> {
        return this.sectionService.getAll();
    }

    @Auth()
    @Get('by-slug/:sectionSlug')
    @HttpCode(HttpStatus.OK)
    getBySlug(@Param('sectionSlug') sectionSlug: string): Promise<Section> {
        return this.sectionService.getBySlug(sectionSlug);
    }

    //Admin place

    @Auth('ADMIN')
    @Get('by-id/:sectionId')
    @HttpCode(HttpStatus.OK)
    getById(@Param('sectionId') sectionId: string): Promise<Section> {
        return this.sectionService.getById(sectionId);
    }

    @Auth('ADMIN')
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(
        @Body() createSectionDto: CreateSectionDto,
    ): Promise<{ id: string }> {
        return this.sectionService.create(createSectionDto);
    }

    @Auth('ADMIN')
    @Put(':sectionId')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('sectionId') sectionId: string,
        @Body() sectionDto: UpdateSectionDto,
    ): Promise<Section> {
        return this.sectionService.update(sectionId, sectionDto);
    }

    @Auth('ADMIN')
    @Delete(':sectionId')
    @HttpCode(HttpStatus.OK)
    delete(@Param('sectionId') sectionId: string): Promise<Section> {
        return this.sectionService.delete(sectionId);
    }
}
