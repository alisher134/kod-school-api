import { Module } from '@nestjs/common';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';

import { isDev } from '@common/utils';

@Module({
    imports: [
        I18nModule.forRoot({
            fallbackLanguage: 'kz',
            fallbacks: {
                'kz-KZ': 'kz',
                'ru-RU': 'ru',
            },
            loaderOptions: {
                path: path.join(__dirname, '../../i18n'),
                watch: isDev,
            },
            typesOutputPath: isDev
                ? path.join(process.cwd(), '/src/generated/i18n.generated.ts')
                : undefined,
            resolvers: [new HeaderResolver(['x-lang'])],
        }),
    ],
})
export class NestI18nModule {}
