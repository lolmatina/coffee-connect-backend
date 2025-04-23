import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateItemVariantDto {
  @ApiProperty({ 
    description: 'The label of the variant (e.g., "Small", "Medium", "Large")',
    example: 'Medium',
    required: true
  })
  @IsString()
  label: string;

  @ApiProperty({ 
    description: 'The price of this variant',
    example: 4.5,
    required: true
  })
  @IsNumber()
  price: number;
} 