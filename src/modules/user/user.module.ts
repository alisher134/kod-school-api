import { Module } from '@nestjs/common';

import { HashService } from '@modules/hash';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    providers: [UserService, UserRepository, HashService],
    exports: [UserService, UserRepository],
})
export class UserModule {}
