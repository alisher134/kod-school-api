import { IsBoolean, IsString } from 'class-validator';

export class CreateProgressDto {
    @IsBoolean()
    isCompleted: boolean;

    @IsString()
    lessonId: string;
}
