import { IsNumber, IsString } from 'class-validator';

export class UpdateLessonDto {
    @IsString()
    title: string;

    @IsString()
    videoUrl: string;

    @IsString()
    sectionId: string;

    @IsNumber()
    order: number;
}
