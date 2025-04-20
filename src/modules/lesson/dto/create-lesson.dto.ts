import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    courseId: string;
}
