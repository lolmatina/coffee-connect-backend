import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId, GetCurrentUserParam } from 'src/common/decorators';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Brands')
@UseGuards(AtGuard)
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'The brand has been successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not enough permissions' })
  @Post()
  create(@Body() createBrandDto: CreateBrandDto, @GetCurrentUserParam('role') role: string, @GetCurrentUserId() userId: number) {
    return this.brandService.create(createBrandDto, role, userId);
  }

  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({ status: 200, description: 'Returns all brands the user has access to' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  findAll(@GetCurrentUserParam('role') role: string, @GetCurrentUserId() userId: number) {
    return this.brandService.findAll(role, userId);
  }

  @ApiOperation({ summary: 'Get a brand by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the brand' })
  @ApiResponse({ status: 200, description: 'Returns the brand' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a brand' })
  @ApiParam({ name: 'id', description: 'The ID of the brand' })
  @ApiResponse({ status: 200, description: 'The brand has been successfully updated' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not enough permissions' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
    @GetCurrentUserParam('role') role: string,
  ) {
    return this.brandService.update(id, updateBrandDto, role);
  }

  @ApiOperation({ summary: 'Delete a brand' })
  @ApiParam({ name: 'id', description: 'The ID of the brand' })
  @ApiResponse({ status: 200, description: 'The brand has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not enough permissions' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetCurrentUserParam('role') role: string) {
    return this.brandService.remove(id, role);
  }
}