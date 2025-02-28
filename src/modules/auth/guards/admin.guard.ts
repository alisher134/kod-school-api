import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import type { User } from '@prisma/client';

import { translate } from '@infrastructure/i18n';

export class AdminGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
        const request = ctx.switchToHttp().getRequest<{ user: User }>();
        const user = request.user;

        if (user.role !== 'ADMIN')
            throw new ForbiddenException(translate('exception.rights'));

        return true;
    }
}
