import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req) {
        // Ideally use LocalGuard, but for brevity direct call or use AuthService validation
        // Here assuming 'req' contains { email, password }
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            return { message: 'Invalid credentials' };
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    async logout(@Request() req) {
        await this.authService.logout(req.user.userId);
        return { message: 'Logged out successfully' };
    }

    @Post('refresh')
    async refreshTokens(@Body() body) {
        // body should contain { userId, refreshToken } or just refreshToken if we decode?
        // Usually refresh flow: Send RT in Body or Cookie.
        // If simply RT, we verify it.
        // But AuthService.refreshTokens needs userId.
        // We can decode RT to get userId, or client sends userId.
        // Standard JWT payload usually has 'sub' (userId).
        // Let's assume body has { userId, refreshToken } for simplicity OR decode.
        // Better: decoding it here or in service.
        // Let's update `refreshTokens` in `AuthService` to decode first? Or assume client sends ID? client usually sends just token.
        // I will update AuthService to generic if needed, but for now let's ask client to send both? No that's insecure/bad UX.
        // Client sends `refreshToken`. Backend decodes.
        // I'll update Controller to decode or Service to decode.
        // Let's modify Controller to decode for now using JwtService (need injection) or just pass to service and let service decode?

        // Wait, `AuthService.refreshTokens(userId, rt)` needs userId.
        // I need to extract userId from RT. 
        // I'll update this method to be `refreshTokens(refreshToken: string)`.

        return this.authService.refreshTokens(body.refreshToken);
    }
}
