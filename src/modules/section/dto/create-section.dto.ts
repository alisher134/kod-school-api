import { IsString } from 'class-validator';

export class CreateSectionDto {
    @IsString()
    courseId: string;
}
