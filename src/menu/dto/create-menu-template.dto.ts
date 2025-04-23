import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuTemplateDto {
  @ApiProperty({ 
    description: 'The name of the menu template',
    example: 'Summer Menu 2023',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'The ID of the brand this template belongs to',
    example: 1,
    required: true
  })
  @IsInt()
  brandId: number;
} 