import { Prisma } from '@prisma/generated';

export const CommentSelect: Prisma.CommentSelect = {
    id: true,
    createdAt: true,
    updatedAt: true,
    text: true,
    user: {
        select: {
            id: true,
            avatarPath: true,
            firstName: true,
            lastName: true,
        },
    },
    lesson: {
        select: {
            id: true,
            slug: true,
        },
    },
};
