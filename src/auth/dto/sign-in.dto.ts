import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class SignInDto {
    @ApiProperty({
        description: 'Email address for login',
        example: 'user@example.com',
        required: true
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: 'User password',
        example: 'P@ssw0rd123',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    password: string
    
}

