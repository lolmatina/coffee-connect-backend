import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignUserToBrandDto {
  @ApiProperty({
    description: 'ID of the user to assign',
    example: 42,
    required: true
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'ID of the brand to assign the user to',
    example: 7,
    required: true
  })
  @IsInt()
  @IsNotEmpty()
  brandId: number;
} 