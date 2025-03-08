import { Module } from '@nestjs/common';

import { SectionController } from './section.controller';
import { SectionRepository } from './section.repository';
import { SectionService } from './section.service';

@Module({
    controllers: [SectionController],
    providers: [SectionService, SectionRepository],
    exports: [SectionService],
})
export class SectionModule {}
