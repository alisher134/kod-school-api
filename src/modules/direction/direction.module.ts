import { Module } from '@nestjs/common';

import { DirectionController } from './direction.controller';
import { DirectionRepository } from './direction.repository';
import { DirectionService } from './direction.service';

@Module({
    controllers: [DirectionController],
    providers: [DirectionService, DirectionRepository],
})
export class DirectionModule {}
