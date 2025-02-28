import { UseGuards, applyDecorators } from '@nestjs/common';
import type { UserRole } from '@prisma/client';

import { AdminGuard, JwtGuard } from '../guards';

export const Auth = (role: UserRole = 'STUDENT') =>
    applyDecorators(
        role === 'ADMIN'
            ? UseGuards(JwtGuard, AdminGuard)
            : UseGuards(JwtGuard),
    );
