import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import type { User } from '@prisma/generated';

export const CurrentUser = createParamDecorator(
    (data: keyof User, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        return data ? user?.[data] : user;
    },
);
