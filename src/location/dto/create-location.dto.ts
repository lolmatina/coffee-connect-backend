import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDecimal } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ 
    description: 'Latitude coordinate of the location',
    example: 40.7128,
    required: true
  })
  @IsDecimal()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ 
    description: 'Longitude coordinate of the location',
    example: -74.0060,
    required: true
  })
  @IsDecimal()
  @IsNotEmpty()
  longitude: number;

  @ApiPropertyOptional({ 
    description: 'Google Maps place ID',
    example: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    required: false
  })
  @IsString()
  @IsOptional()
  placeId?: string;

  @ApiPropertyOptional({ 
    description: 'Name of the location',
    example: 'Downtown Coffee Shop',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Full address of the location',
    example: '123 Main Street',
    required: false
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ 
    description: 'City of the location',
    example: 'New York',
    required: false
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ 
    description: 'State/province of the location',
    example: 'NY',
    required: false
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ 
    description: 'Country of the location',
    example: 'USA',
    required: false
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ 
    description: 'Postal/ZIP code of the location',
    example: '10001',
    required: false
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ 
    description: 'Geohash for location-based queries',
    example: 'dr5r7p',
    required: false
  })
  @IsString()
  @IsOptional()
  geohash?: string;

  @ApiPropertyOptional({ 
    description: 'Timezone of the location',
    example: 'America/New_York',
    required: false
  })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional({ 
    description: 'Accuracy of the location coordinates in meters',
    example: 10.5,
    required: false
  })
  @IsDecimal()
  @IsOptional()
  accuracy?: number;

  @ApiPropertyOptional({ 
    description: 'ID of the manager assigned to this location',
    example: 42,
    required: false
  })
  @IsNumber()
  @IsOptional()
  managerId?: number;

  @ApiProperty({ 
    description: 'ID of the brand this location belongs to',
    example: 5,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  BrandId: number;
}