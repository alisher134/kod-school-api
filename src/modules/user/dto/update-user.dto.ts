import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @Matches(/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/)
    firstName?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @Matches(/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/)
    lastName?: string;

    @IsOptional()
    @IsString()
    avatarPath?: string;

    @IsOptional()
    @IsString()
    @MinLength(50)
    description?: string;
}
