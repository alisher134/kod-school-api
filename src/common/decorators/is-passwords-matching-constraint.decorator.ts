import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

import { translate } from '@infrastructure/i18n';

import { RestorePasswordDto } from '@modules/auth/dto';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint
    implements ValidatorConstraintInterface
{
    validate(passwordConfirm: string, args: ValidationArguments): boolean {
        const obj = args.object as RestorePasswordDto;
        return obj.password === passwordConfirm;
    }

    defaultMessage(): string {
        return translate('exception.isPasswordsMatchingConstraint');
    }
}
