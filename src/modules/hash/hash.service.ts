import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';

@Injectable()
export class HashService {
    async hashPassword(password: string): Promise<string> {
        return hash(password);
    }

    async comparePassword(
        hashPassword: string,
        password: string,
    ): Promise<boolean> {
        return verify(hashPassword, password);
    }
}
