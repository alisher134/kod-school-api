import type { User } from '@prisma/client';

export interface IUserProfile {
    profile: Omit<User, 'password'>;
}
