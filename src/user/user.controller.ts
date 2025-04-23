import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId, GetCurrentUserParam } from 'src/common/decorators';
import { UpdateUserDto, AssignUserToBrandDto, AssignUserToLocationDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'role', required: false, description: 'Filter users by role' })
  @ApiResponse({ status: 200, description: 'Returns all users the requester has access to' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get()
  findAll(
    @GetCurrentUserId() userId: number, 
    @GetCurrentUserParam('role') role: string,
    @Query('role') roleFilter?: string
  ) {
    return this.userService.findAll(userId, role, roleFilter);
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'Returns the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetCurrentUserId() userId: number, @GetCurrentUserParam('role') role: string) {
    return this.userService.findOne(id, userId, role);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @GetCurrentUserId() userId: number,
    @GetCurrentUserParam('role') role: string
  ) {
    return this.userService.update(id, updateUserDto, userId, role);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUserId() userId: number,
    @GetCurrentUserParam('role') role: string
  ) {
    return this.userService.remove(id, userId, role);
  }

  @ApiOperation({ summary: 'Assign a user to a brand' })
  @ApiResponse({ status: 201, description: 'The user has been successfully assigned to the brand' })
  @ApiResponse({ status: 404, description: 'User or brand not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post('assign-to-brand')
  assignToBrand(
    @Body() dto: AssignUserToBrandDto,
    @GetCurrentUserId() userId: number,
    @GetCurrentUserParam('role') role: string
  ) {
    return this.userService.assignToBrand(dto, userId, role);
  }

  @ApiOperation({ summary: 'Assign a user to a location' })
  @ApiResponse({ status: 201, description: 'The user has been successfully assigned to the location' })
  @ApiResponse({ status: 404, description: 'User or location not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post('assign-to-location')
  assignToLocation(
    @Body() dto: AssignUserToLocationDto,
    @GetCurrentUserId() userId: number,
    @GetCurrentUserParam('role') role: string
  ) {
    return this.userService.assignToLocation(dto, userId, role);
  }
} 