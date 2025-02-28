import { UseGuards, applyDecorators } from '@nestjs/common';
import type { UserRole } from '@prisma/client';

import { AdminGuard } from '../guards/admin.guard';
import { JwtGuard } from '../guards/jwt.guard';

export const Auth = (role: UserRole = 'STUDENT') =>
    applyDecorators(
        role === 'ADMIN'
            ? UseGuards(JwtGuard, AdminGuard)
            : UseGuards(JwtGuard),
    );
