import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, ForbiddenException, Request, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RtGuard, AtGuard } from 'src/common/guards';
import { GetCurrentUserId, GetCurrentUserParam, Public } from 'src/common/decorators';
import { SignInDto } from './dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { Token } from './types';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Sign in with email and password' })
    @ApiResponse({ status: 200, description: 'Returns access and refresh tokens' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @Public()
    signIn(@Body() dto: SignInDto): Promise<Token> {
        return this.authService.signIn(dto)
    }
    
    @ApiOperation({ summary: 'Get the current user information' })
    @ApiResponse({ status: 200, description: 'Returns the current user information' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    @UseGuards(AtGuard)
    @Get('me')
    getMe(@GetCurrentUserId() userId: number) {
        return this.authService.getMe(userId);
    }
    
    @ApiOperation({ summary: 'Invite a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully invited' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBearerAuth()
    @UseGuards(AtGuard)
    @Post('invite-user')
    inviteUser(@Body() dto: InviteUserDto, @GetCurrentUserId() userId: number) {
        return this.authService.inviteUser(dto, userId);
    }

    @ApiOperation({ summary: 'Logout the current user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully logged out' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    @UseGuards(AtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Request() req: Request, @GetCurrentUserId() userId: number) {
        return this.authService.logout(userId);
    }

    @ApiOperation({ summary: 'Refresh access token using refresh token' })
    @ApiResponse({ status: 200, description: 'Returns new access and refresh tokens' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUserId() userId: number, @GetCurrentUserParam('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(userId, refreshToken)
    }

    @ApiOperation({ summary: 'Create a new user (Super Admin only)' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Only super admins can create users directly' })
    @ApiBearerAuth()
    @UseGuards(AtGuard)
    @Post('create-user')
    createUser(@Body() dto: CreateUserDto, @GetCurrentUserParam('role') role: string) {
        // Only Super Admins can create users directly
        if (role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Not authorized to create users directly');
        }
        return this.authService.createUser(dto);
    }
}