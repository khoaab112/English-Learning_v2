import { Injectable, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            if (user.status === 'BLOCKED') {
                throw new ForbiddenException('Tài khoản của bạn đã bị chặn, hãy liên hệ admin để được hỗ trợ');
            }
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async getTokens(userId: number, email: string, role: string) {
        const payload = { sub: userId, email, role };
        const atExp = this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m';
        const rtExp = this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '30d';

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, { expiresIn: atExp as any }),
            this.jwtService.signAsync(payload, { expiresIn: rtExp as any }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    async login(user: any) {
        const tokens = await this.getTokens(user.id, user.email, user.role);
        // await this.updateRefreshToken(user.id, tokens.refresh_token); // Separate method
        const hashedRt = await bcrypt.hash(tokens.refresh_token, 10);
        await this.usersService.update(user.id, { refreshToken: hashedRt });

        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                role: user.role,
            }
        };
    }

    async logout(userId: number) {
        return this.usersService.update(userId, { refreshToken: null });
    }

    async refreshTokens(rt: string) {
        let payload: any;
        try {
            payload = await this.jwtService.verifyAsync(rt);
        } catch (e) {
            throw new ForbiddenException('Invalid Refresh Token');
        }

        const userId = payload.sub;
        const user = await this.usersService.findOne(userId);
        if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

        const rtMatches = await bcrypt.compare(rt, user.refreshToken);
        if (!rtMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email, user.role);
        const hashedRt = await bcrypt.hash(tokens.refresh_token, 10);
        await this.usersService.update(user.id, { refreshToken: hashedRt });

        return tokens;
    }

    async register(createUserDto: any) {
        return this.usersService.create(createUserDto);
    }
}
