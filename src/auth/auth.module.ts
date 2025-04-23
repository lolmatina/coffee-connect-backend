import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { RtStrategy, AtStrategy } from "./strategies";

@Module({
    imports: [JwtModule.register({ })],
    controllers: [AuthController],
    providers: [AuthService, AtStrategy, RtStrategy]
  })    
export class AuthModule {}