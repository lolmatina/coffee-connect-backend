import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateTemplateItemVariantDto } from './create-template-item-variant.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTemplateItemDto {
  @ApiProperty({ 
    description: 'The name of the menu item',
    example: 'Cappuccino',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ 
    description: 'The description of the menu item',
    example: 'Our signature coffee with frothy milk and a sprinkle of cocoa',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'URL to the image of the menu item',
    example: 'https://example.com/images/cappuccino.jpg',
    required: false
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ 
    description: 'The category of the menu item',
    example: 'Coffee',
    required: false
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ 
    description: 'The ID of the menu template this item belongs to',
    example: 1,
    required: true
  })
  @IsInt()
  templateId: number;

  @ApiPropertyOptional({ 
    description: 'The variants of this menu item',
    type: [CreateTemplateItemVariantDto],
    example: [
      {
        label: 'Small',
        price: 3.5
      },
      {
        label: 'Medium',
        price: 4.5
      },
      {
        label: 'Large',
        price: 5.5
      }
    ],
    required: false
  })
  @IsOptional()
  @Type(() => CreateTemplateItemVariantDto)
  variants?: CreateTemplateItemVariantDto[];
} 