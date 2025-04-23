import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"
import { UserRole } from "@prisma/client"

type JwtPayload = {
    sub: string,
    email: string,
    role: UserRole
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.AT_SECRET
        })
    }

    validate(payload: JwtPayload) {
        return payload
    }
}