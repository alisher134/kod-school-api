import { IsString, MinLength, Validate } from 'class-validator';

import { IsPasswordsMatchingConstraint } from '@common/decorators';

export class RestorePasswordDto {
    @IsString()
    token: string;

    @IsString()
    @MinLength(8)
    newPassword: string;

    @IsString()
    @MinLength(8)
    @Validate(IsPasswordsMatchingConstraint)
    passwordConfirm: string;
}
