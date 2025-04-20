import { IsOptional, IsString } from 'class-validator';

export class UpdateLessonDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    courseId: string;

    @IsString()
    @IsOptional()
    lessonUrl: string;

    @IsString()
    @IsOptional()
    description: string;
}
