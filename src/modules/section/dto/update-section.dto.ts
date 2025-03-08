import { IsString } from 'class-validator';

export class UpdateSectionDto {
    @IsString()
    name: string;

    @IsString()
    courseId: string;
}
