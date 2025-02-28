import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
} from '@nestjs/common';

import { Auth, CurrentUser } from '@modules/auth/decorators';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Auth()
    @Get('profile')
    @HttpCode(HttpStatus.OK)
    profile(@CurrentUser('id') userId: string) {
        return this.userService.getProfile(userId);
    }

    @Auth()
    @Patch('profile')
    @HttpCode(HttpStatus.OK)
    updateProfile(
        @CurrentUser('id') userId: string,
        @Body() updateUser: UpdateUserDto,
    ) {
        return this.userService.update(updateUser, userId);
    }
}
