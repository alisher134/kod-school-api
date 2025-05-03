import { Body, Controller, Param, Post } from '@nestjs/common';

import { Auth, CurrentUser } from '@modules/auth/decorators';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Auth()
    @Post(':lessonId')
    createComment(
        @Param('lessonId') lessonId: string,
        @CurrentUser('id') id: string,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        return this.commentService.create(lessonId, id, createCommentDto);
    }
}
