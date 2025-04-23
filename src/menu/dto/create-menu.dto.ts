import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ 
    description: 'The ID of the location for this menu',
    example: 1,
    required: true
  })
  @IsInt()
  locationId: number;

  @ApiProperty({ 
    description: 'The ID of the menu template to use',
    example: 2,
    required: true
  })
  @IsInt()
  templateId: number;
} 