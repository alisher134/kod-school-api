import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
} from '@nestjs/common';
import type { User } from '@prisma/client';

import { Auth, CurrentUser } from '@modules/auth/decorators';

import { UpdateUserDto } from './dto/update-user.dto';
import type { IUserProfile } from './user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Auth()
    @Get('profile')
    @HttpCode(HttpStatus.OK)
    profile(@CurrentUser('id') userId: string): Promise<IUserProfile> {
        return this.userService.getProfile(userId);
    }

    @Auth()
    @Patch('profile')
    @HttpCode(HttpStatus.OK)
    updateProfile(
        @CurrentUser('id') userId: string,
        @Body() updateUser: UpdateUserDto,
    ): Promise<User> {
        return this.userService.update(updateUser, userId);
    }
}
