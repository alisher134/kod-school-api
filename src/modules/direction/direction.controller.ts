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

import { Direction } from '@prisma/generated';

import { Auth } from '@modules/auth/decorators';

import { DirectionService } from './direction.service';
import { UpdateDirectionDto } from './dto';

@Controller('direction')
export class DirectionController {
    constructor(private readonly directionService: DirectionService) {}

    @Auth()
    @Get('by-slug/:directionSlug')
    @HttpCode(HttpStatus.OK)
    getBySlug(
        @Param('directionSlug') directionSlug: string,
    ): Promise<Direction> {
        return this.directionService.getBySlug(directionSlug);
    }

    //Admin place

    @Auth('ADMIN')
    @Get()
    @HttpCode(HttpStatus.OK)
    getAll(): Promise<Direction[]> {
        return this.directionService.getAll();
    }

    @Auth('ADMIN')
    @Get('by-id/:directionId')
    @HttpCode(HttpStatus.OK)
    getById(@Param('directionId') directionId: string): Promise<Direction> {
        return this.directionService.getById(directionId);
    }

    @Auth('ADMIN')
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(): Promise<{ id: string }> {
        return this.directionService.create();
    }

    @Auth('ADMIN')
    @Put(':directionId')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('directionId') directionId: string,
        @Body() directionDto: UpdateDirectionDto,
    ): Promise<Direction> {
        return this.directionService.update(directionId, directionDto);
    }

    @Auth('ADMIN')
    @Delete(':directionId')
    @HttpCode(HttpStatus.OK)
    delete(@Param('directionId') directionId: string): Promise<Direction> {
        return this.directionService.delete(directionId);
    }
}
