import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "prisma/app/generated/prisma/client"

export class CreateUserDto {
    @ApiProperty({
        description: 'Email address of the user',
        example: 'john.doe@example.com',
        required: true
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: 'User password',
        example: 'StrongP@ssw0rd',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    password: string

    @ApiProperty({
        description: 'First name of the user',
        example: 'John',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    firstName: string

    @ApiProperty({
        description: 'Last name of the user',
        example: 'Doe',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    lastName: string
    
    @ApiProperty({
        description: 'Role of the user',
        enum: UserRole,
        example: 'COFFEE_SHOP_MANAGER',
        required: true
    })
    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole
}