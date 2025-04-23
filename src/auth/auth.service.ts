import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { SignInDto, CreateUserDto, InviteUserDto } from './dto';
import { Token, User, UserRole } from './types';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async hashData(data: string) {
        return await bcrypt.hash(data, 10)
    }

    async generateToken(userId: number, email: string, role: string): Promise<Token> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    role: role
                },
                {
                    secret: process.env.AT_SECRET,
                    expiresIn: 60 * 15
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    role: role
                },
                {
                    secret: process.env.RT_SECRET,
                    expiresIn: 60 * 60 * 24 * 7
                }
            ),
        ])

        return {accessToken, refreshToken}
    }
    
    async signIn(dto: SignInDto): Promise<Token> {
        if (dto.email === process.env.ADMIN_EMAIL && dto.password === process.env.ADMIN_PASSWORD) {
            const tokens = await this.generateToken(-1, process.env.ADMIN_EMAIL, 'SUPER_ADMIN')
            return tokens
        }

        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        })

        if (!user) throw new ForbiddenException('User not found')
        
        const passwordMatch = await bcrypt.compare(dto.password, user.password)

        if (!passwordMatch) throw new ForbiddenException('Invalid credentials')

        const tokens = await this.generateToken(user.id, user.email, user.role)
        await this.updateRtHash(user.id, tokens.refreshToken)

        return tokens
    }

    async inviteUser(dto: InviteUserDto, currentUserId: number) {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: currentUserId }
        });

        if (!currentUser) throw new ForbiddenException('User not found');

        // Check permissions based on role
        if (currentUser.role !== 'SUPER_ADMIN' && 
            currentUser.role !== 'COFFEE_SHOP_OWNER') {
            throw new ForbiddenException('Not authorized to invite users');
        }
        
        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await this.hashData(tempPassword);
        
        // Determine which role the invited user can have based on inviter's role
        let allowedRoles: string[] = [];
        if (currentUser.role === 'SUPER_ADMIN') {
            allowedRoles = ['COFFEE_SHOP_OWNER'];
        } else if (currentUser.role === 'COFFEE_SHOP_OWNER') {
            allowedRoles = ['COFFEE_SHOP_MANAGER', 'COFFEE_SHOP_STAFF'];
        }
        
        // For now, just create the user with the first allowed role
        // In a real app, you'd send an email with the temp password
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: allowedRoles[0] as any, // Cast to any to avoid type issues
                UserProfile: {
                    create: {
                        firstName: 'Invited',
                        lastName: 'User'
                    }
                }
            }
        });
        
        return {
            message: 'User invited successfully',
            email: newUser.email,
            role: newUser.role,
            temporaryPassword: tempPassword // In production, send this via email instead
        };
    }

    async getMe(userId: number): Promise<User> {
        if (userId === -1) {
            return {
                id: -1,
                email: process.env.ADMIN_EMAIL as string,
                role: 'SUPER_ADMIN',
                UserProfile: {
                    firstName: 'Super',
                    lastName: 'Admin'
                },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                UserProfile: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        })

        if (!user) throw new ForbiddenException('User not found')

        return {
            id: user.id,
            email: user.email,
            role: user.role as UserRole,
            UserProfile: {
                firstName: user.UserProfile[0].firstName,
                lastName: user.UserProfile[0].lastName
            },
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    async logout(userId: number) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                refreshToken: {
                    not: null
                }
            },
            data: {
                refreshToken: null
            }
        })
    }

    async refreshTokens(userId: number, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')
        
        
    }

    async updateRtHash(userId: number, rt: string) {
        const hash = await this.hashData(rt)
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: hash
            }
        })
    }

    async createUser(dto: CreateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });

        if (user) throw new ForbiddenException('User already exists');

        const hashedPassword = await this.hashData(dto.password);
        
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: dto.role,
                UserProfile: {
                    create: {
                        firstName: dto.firstName,
                        lastName: dto.lastName
                    }
                }
            },
            include: {
                UserProfile: true
            }
        });

        return {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            UserProfile: newUser.UserProfile[0]
        };
    }

}