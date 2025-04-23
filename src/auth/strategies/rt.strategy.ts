import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { FastifyRequest } from 'fastify'
import { Injectable, UnauthorizedException } from "@nestjs/common"

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.RT_SECRET,
            passReqToCallback: true
        })
    }

    validate(req: FastifyRequest, payload: any) {
        const auth_header = req['headers'].authorization

        if (!auth_header || !auth_header.startsWith('Bearer ')) {
            throw new UnauthorizedException()
        }

        const refresh_token = auth_header.split(" ")[1]

        return {
            ...payload,
            refresh_token
        }
    }
}