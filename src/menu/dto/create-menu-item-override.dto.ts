import { IsBoolean, IsInt, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuItemOverrideDto {
  @ApiProperty({ 
    description: 'The ID of the menu this override belongs to',
    example: 1,
    required: true
  })
  @IsInt()
  menuId: number;

  @ApiProperty({ 
    description: 'The ID of the template item being overridden',
    example: 5,
    required: true
  })
  @IsInt()
  templateItemId: number;

  @ApiPropertyOptional({ 
    description: 'Whether this item is available at this location',
    example: false,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({ 
    description: 'The overridden price for this item at this location',
    example: 5.99,
    required: false
  })
  @IsNumber()
  @IsOptional()
  priceOverride?: number;
} 