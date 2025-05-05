import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '@modules/pagination/pagination.dto';

export class FilterCourseDto extends PaginationDto {
    @IsOptional()
    @IsString()
    searchTerm?: string;
}
