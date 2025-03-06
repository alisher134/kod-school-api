import { UseGuards, applyDecorators } from '@nestjs/common';

import type { UserRole } from '@prisma/generated';

import { AdminGuard, JwtGuard } from '../guards';

export const Auth = (role: UserRole = 'STUDENT') => {
    const guards = role === 'ADMIN' ? [JwtGuard, AdminGuard] : [JwtGuard];
    return applyDecorators(UseGuards(...guards));
};
