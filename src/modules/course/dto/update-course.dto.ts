import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    thumbnail: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    requirements: string[];

    @IsString()
    @IsOptional()
    subTitle: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    techs: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    directionIds: string[];
}
