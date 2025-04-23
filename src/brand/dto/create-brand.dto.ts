import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Name of the coffee brand',
    example: 'Coffee Delight',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ID of the brand owner',
    example: 123,
    required: true
  })
  @IsNumber()
  ownerId: number;
}