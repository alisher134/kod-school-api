import type { User } from '@prisma/generated';

export interface IUserProfile {
    profile: User;
}

export interface ILastLesson {
    id: string;
    slug: string;
    position: number;
}
