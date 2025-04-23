import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiBearerAuth()
@ApiTags('Locations')
@UseGuards(AtGuard)
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, description: 'The location has been successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: 200, description: 'Returns all locations for the user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  findAll(@GetCurrentUserId() userId: number) {
    return this.locationService.findAll(userId);
  }

  @ApiOperation({ summary: 'Get a location by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the location' })
  @ApiResponse({ status: 200, description: 'Returns the location' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  @ApiOperation({ summary: 'Get staff assigned to a location' })
  @ApiParam({ name: 'id', description: 'The ID of the location' })
  @ApiResponse({ status: 200, description: 'Returns staff for the location' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id/staff')
  findLocationUsers(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findLocationUsers(id);
  }

  @ApiOperation({ summary: 'Update a location' })
  @ApiParam({ name: 'id', description: 'The ID of the location' })
  @ApiResponse({ status: 200, description: 'The location has been successfully updated' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, updateLocationDto);
  }

  @ApiOperation({ summary: 'Delete a location' })
  @ApiParam({ name: 'id', description: 'The ID of the location' })
  @ApiResponse({ status: 200, description: 'The location has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.remove(id);
  }
}