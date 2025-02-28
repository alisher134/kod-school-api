import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

import { IConfigs } from '@infrastructure/config';

import type { IMediaResponse } from './media.interface';

@Injectable()
export class MediaService {
    constructor(private readonly configService: ConfigService<IConfigs>) {}

    async saveMedia(
        mediaFile: Express.Multer.File,
        folder = 'default',
    ): Promise<IMediaResponse> {
        const uploadFolder = `${path}/uploads/${folder}`;
        await ensureDir(uploadFolder);

        const originalName = mediaFile.originalname;
        const fileName = `${originalName}`;
        const filePath = `${uploadFolder}/${fileName}`;

        await writeFile(filePath, mediaFile.buffer);

        const baseUrl = this.configService.get('app.url', { infer: true });
        return {
            url: `${baseUrl}/uploads/${folder}/${fileName}`,
            name: mediaFile.originalname,
        };
    }
}
