import { Injectable, NotFoundException } from '@nestjs/common';

import { Comment } from '@prisma/generated';

import { PrismaService } from '@infrastructure/prisma';

import { CommentSelect } from './comment.select';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
    constructor(private readonly prismaService: PrismaService) {}

    async getById(id: string): Promise<Comment> {
        const comment = await this.prismaService.comment.findUnique({
            where: {
                id,
            },
            select: CommentSelect,
        });

        if (!comment) throw new NotFoundException('Comment not found!');

        return comment;
    }

    async create(lessonId: string, id: string, dto: CreateCommentDto) {
        const lesson = await this.prismaService.lesson.findUnique({
            where: {
                id: lessonId,
            },
        });
        if (!lesson) throw new NotFoundException('Lesson not found');

        const comment = await this.prismaService.comment.create({
            data: {
                text: dto.text,
                lesson: {
                    connect: {
                        id: lessonId,
                    },
                },
                user: {
                    connect: {
                        id,
                    },
                },
            },
            select: CommentSelect,
        });

        return comment;
    }
}
