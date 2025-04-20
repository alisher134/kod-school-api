import { Prisma } from '@prisma/generated';

export const CourseSelect: Prisma.CourseSelect = {
    id: true,
    createdAt: true,
    updatedAt: true,
    title: true,
    slug: true,
    description: true,
    thumbnail: true,
    views: true,
    lessons: true,
};
