import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignUserToLocationDto {
  @ApiProperty({
    description: 'ID of the user to assign',
    example: 42,
    required: true
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'ID of the location to assign the user to',
    example: 15,
    required: true
  })
  @IsInt()
  @IsNotEmpty()
  locationId: number;

  @ApiProperty({
    description: 'Whether the user should be assigned as a manager (true) or staff (false)',
    example: true,
    required: true
  })
  @IsBoolean()
  @IsNotEmpty()
  isManager: boolean;
} 