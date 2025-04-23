import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class InviteUserDto {
    @ApiProperty({
        description: 'Email address of the user to invite',
        example: 'newuser@example.com',
        required: true
    })
    @IsEmail()
    @IsNotEmpty()
    email: string
}