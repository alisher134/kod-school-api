import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import type { User } from '@prisma/client';

import { translate } from '@infrastructure/i18n';

export class AdminGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
        const { user } = ctx.switchToHttp().getRequest<{ user: User }>();

        if (user.role !== 'ADMIN')
            throw new ForbiddenException(translate('exception.rights'));

        return true;
    }
}
