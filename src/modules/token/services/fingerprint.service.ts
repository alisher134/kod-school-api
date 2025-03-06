import { Injectable } from '@nestjs/common';
import { type Request } from 'express';

import { isDev } from '@common/utils';

import { HashService } from '@modules/hash';

@Injectable()
export class FingerprintService {
    constructor(private readonly hashService: HashService) {}

    async generateFingerprint(req: Request): Promise<string> {
        const userAgent = req.headers['user-agent'];
        const ip = this.getIpAddress(req);

        return await this.hashFingerprint(`${userAgent}-${ip}`);
    }

    async compareFingerprints(
        fingerprint: string,
        hashFingerprint: string,
    ): Promise<boolean> {
        return await this.hashService.comparePassword(
            hashFingerprint,
            fingerprint,
        );
    }

    private async hashFingerprint(fingerprint: string): Promise<string> {
        return await this.hashService.hashPassword(fingerprint);
    }

    private getIpAddress(req: Request): string {
        const isDevIp = '91.198.101.0';
        return isDev
            ? isDevIp
            : Array.isArray(req.headers['cf-connecting-ip'])
              ? req.headers['cf-connecting-ip'][0]
              : req.headers['cf-connecting-ip'] ||
                (typeof req.headers['x-forwarded-for'] === 'string'
                    ? req.headers['x-forwarded-for'].split(',')[0]
                    : req.ip);
    }
}
