import { Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

import { translate } from '@infrastructure/i18n';

@Injectable()
export class I18nThrottlerGuard extends ThrottlerGuard {
    protected async throwThrottlingException(): Promise<void> {
        throw new ThrottlerException(translate('exception.tooManyRequests'));
    }
}
