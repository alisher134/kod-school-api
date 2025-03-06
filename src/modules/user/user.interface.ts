import type { User } from '@prisma/generated';

export interface IUserProfile {
    profile: Omit<User, 'password'>;
}
