import { I18nContext, type TranslateOptions } from 'nestjs-i18n';
import { I18nPath, I18nTranslations } from 'src/generated';

export function translate(
    key: I18nPath,
    options: TranslateOptions = {},
): string {
    const i18nContext = I18nContext.current<I18nTranslations>();
    return i18nContext ? i18nContext.t(key, options) : key;
}
