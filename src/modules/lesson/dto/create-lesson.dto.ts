import { IsString } from 'class-validator';

export class CreateLessonDto {
    @IsString()
    sectionId: string;
}
