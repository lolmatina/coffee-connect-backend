import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  CreateMenuDto,
  UpdateMenuDto,
  CreateMenuTemplateDto,
  UpdateMenuTemplateDto,
  CreateTemplateItemDto,
  UpdateTemplateItemDto,
  CreateMenuItemOverrideDto,
  UpdateMenuItemOverrideDto,
} from './dto';
import { AtGuard } from '../common/guards';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Menu')
@UseGuards(AtGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Menu Template Routes
  @ApiOperation({ summary: 'Create a new menu template' })
  @ApiResponse({ status: 201, description: 'The menu template has been successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ 
    type: CreateMenuTemplateDto,
    description: 'Menu template creation data',
    examples: {
      example1: {
        summary: 'Create menu template example',
        value: {
          name: 'Summer Menu 2023',
          brandId: 1
        }
      }
    }
  })
  @Post('templates')
  createMenuTemplate(@Body() createMenuTemplateDto: CreateMenuTemplateDto) {
    return this.menuService.createMenuTemplate(createMenuTemplateDto);
  }

  @ApiOperation({ summary: 'Get all menu templates' })
  @ApiResponse({ status: 200, description: 'Returns all menu templates' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('templates')
  findAllMenuTemplates() {
    return this.menuService.findAllMenuTemplates();
  }

  @ApiOperation({ summary: 'Get menu templates by brand ID' })
  @ApiParam({ name: 'brandId', description: 'The ID of the brand' })
  @ApiResponse({ status: 200, description: 'Returns menu templates for the specified brand' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('templates/brand/:brandId')
  findMenuTemplatesByBrand(@Param('brandId', ParseIntPipe) brandId: number) {
    return this.menuService.findMenuTemplatesByBrand(brandId);
  }

  @ApiOperation({ summary: 'Get a menu template by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the menu template' })
  @ApiResponse({ status: 200, description: 'Returns the menu template' })
  @ApiResponse({ status: 404, description: 'Menu template not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('templates/:id')
  findOneMenuTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOneMenuTemplate(id);
  }

  @ApiOperation({ summary: 'Update a menu template' })
  @ApiParam({ name: 'id', description: 'The ID of the menu template' })
  @ApiResponse({ status: 200, description: 'The menu template has been successfully updated' })
  @ApiResponse({ status: 404, description: 'Menu template not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ 
    type: UpdateMenuTemplateDto,
    description: 'Menu template update data',
    examples: {
      example1: {
        summary: 'Update menu template example',
        value: {
          name: 'Updated Summer Menu 2023'
        }
      }
    }
  })
  @Patch('templates/:id')
  updateMenuTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuTemplateDto: UpdateMenuTemplateDto,
  ) {
    return this.menuService.updateMenuTemplate(id, updateMenuTemplateDto);
  }

  @ApiOperation({ summary: 'Delete a menu template' })
  @ApiParam({ name: 'id', description: 'The ID of the menu template' })
  @ApiResponse({ status: 200, description: 'The menu template has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Menu template not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete('templates/:id')
  removeMenuTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.removeMenuTemplate(id);
  }

  // Template Item Routes
  @ApiOperation({ summary: 'Create a new template item' })
  @ApiResponse({ status: 201, description: 'The template item has been successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ 
    type: CreateTemplateItemDto,
    description: 'Template item creation data',
    examples: {
      example1: {
        summary: 'Create simple template item',
        value: {
          name: 'Cappuccino',
          description: 'Our signature coffee with frothy milk',
          category: 'Coffee',
          templateId: 1
        }
      },
      example2: {
        summary: 'Create template item with variants',
        value: {
          name: 'Cappuccino',
          description: 'Our signature coffee with frothy milk',
          category: 'Coffee',
          templateId: 1,
          variants: [
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
          ]
        }
      }
    }
  })
  @Post('template-items')
  createTemplateItem(@Body() createTemplateItemDto: CreateTemplateItemDto) {
    return this.menuService.createTemplateItem(createTemplateItemDto);
  }

  @ApiOperation({ summary: 'Get all template items' })
  @ApiResponse({ status: 200, description: 'Returns all template items' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('template-items')
  findAllTemplateItems() {
    return this.menuService.findAllTemplateItems();
  }

  @ApiOperation({ summary: 'Get template items by template ID' })
  @ApiParam({ name: 'templateId', description: 'The ID of the template' })
  @ApiResponse({ status: 200, description: 'Returns template items for the specified template' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('template-items/template/:templateId')
  findTemplateItemsByTemplate(@Param('templateId', ParseIntPipe) templateId: number) {
    return this.menuService.findTemplateItemsByTemplate(templateId);
  }

  @ApiOperation({ summary: 'Get a template item by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the template item' })
  @ApiResponse({ status: 200, description: 'Returns the template item' })
  @ApiResponse({ status: 404, description: 'Template item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('template-items/:id')
  findOneTemplateItem(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOneTemplateItem(id);
  }

  @ApiOperation({ summary: 'Update a template item' })
  @ApiParam({ name: 'id', description: 'The ID of the template item' })
  @ApiResponse({ status: 200, description: 'The template item has been successfully updated' })
  @ApiResponse({ status: 404, description: 'Template item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ 
    type: UpdateTemplateItemDto,
    description: 'Template item update data',
    examples: {
      example1: {
        summary: 'Update template item name and description',
        value: {
          name: 'Updated Cappuccino',
          description: 'Our signature coffee with frothy milk and cocoa'
        }
      }
    }
  })
  @Patch('template-items/:id')
  updateTemplateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTemplateItemDto: UpdateTemplateItemDto,
  ) {
    return this.menuService.updateTemplateItem(id, updateTemplateItemDto);
  }

  @ApiOperation({ summary: 'Delete a template item' })
  @ApiParam({ name: 'id', description: 'The ID of the template item' })
  @ApiResponse({ status: 200, description: 'The template item has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Template item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete('template-items/:id')
  removeTemplateItem(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.removeTemplateItem(id);
  }

  // Menu Routes
  @ApiOperation({ summary: 'Create a new menu' })
  @ApiResponse({ status: 201, description: 'The menu has been successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ 
    type: CreateMenuDto,
    description: 'Menu creation data',
    examples: {
      example1: {
        summary: 'Create menu example',
        value: {
          locationId: 1,
          templateId: 2
        }
      }
    }
  })
  @Post()
  createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @ApiOperation({ summary: 'Get all menus' })
  @ApiResponse({ status: 200, description: 'Returns all menus' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  findAllMenus() {
    return this.menuService.findAllMenus();
  }

  @ApiOperation({ summary: 'Get menu by location ID' })
  @ApiParam({ name: 'locationId', description: 'The ID of the location' })
  @ApiResponse({ status: 200, description: 'Returns the menu for the specified location' })
  @ApiResponse({ status: 404, description: 'Menu not found for the location' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('location/:locationId')
  findMenuByLocation(@Param('locationId', ParseIntPipe) locationId: number) {
    return this.menuService.findMenuByLocation(locationId);
  }

  @ApiOperation({ summary: 'Get a menu by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the menu' })
  @ApiResponse({ status: 200, description: 'Returns the menu' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  findOneMenu(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOneMenu(id);
  }

  @ApiOperation({ summary: 'Update a menu' })
  @ApiParam({ name: 'id', description: 'The ID of the menu' })
  @ApiResponse({ status: 200, description: 'The menu has been successfully updated' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ 
    type: UpdateMenuDto,
    description: 'Menu update data',
    examples: {
      example1: {
        summary: 'Update menu template',
        value: {
          templateId: 3
        }
      }
    }
  })
  @Patch(':id')
  updateMenu(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.updateMenu(id, updateMenuDto);
  }

  @ApiOperation({ summary: 'Delete a menu' })
  @ApiParam({ name: 'id', description: 'The ID of the menu' })
  @ApiResponse({ status: 200, description: 'The menu has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete(':id')
  removeMenu(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.removeMenu(id);
  }

  // Menu Item Override Routes
  @ApiOperation({ summary: 'Create a new menu item override' })
  @ApiResponse({ status: 201, description: 'The menu item override has been successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ 
    type: CreateMenuItemOverrideDto,
    description: 'Menu item override creation data',
    examples: {
      example1: {
        summary: 'Create menu item override with availability',
        value: {
          menuId: 1,
          templateItemId: 5,
          isAvailable: false
        }
      },
      example2: {
        summary: 'Create menu item override with price change',
        value: {
          menuId: 1,
          templateItemId: 5,
          priceOverride: 5.99
        }
      }
    }
  })
  @Post('overrides')
  createMenuItemOverride(@Body() createMenuItemOverrideDto: CreateMenuItemOverrideDto) {
    return this.menuService.createMenuItemOverride(createMenuItemOverrideDto);
  }

  @ApiOperation({ summary: 'Get menu item overrides by menu ID' })
  @ApiParam({ name: 'menuId', description: 'The ID of the menu' })
  @ApiResponse({ status: 200, description: 'Returns menu item overrides for the specified menu' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('overrides/menu/:menuId')
  findMenuItemOverridesByMenu(@Param('menuId', ParseIntPipe) menuId: number) {
    return this.menuService.findMenuItemOverridesByMenu(menuId);
  }

  @ApiOperation({ summary: 'Update a menu item override' })
  @ApiParam({ name: 'id', description: 'The ID of the menu item override' })
  @ApiResponse({ status: 200, description: 'The menu item override has been successfully updated' })
  @ApiResponse({ status: 404, description: 'Menu item override not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ 
    type: UpdateMenuItemOverrideDto,
    description: 'Menu item override update data',
    examples: {
      example1: {
        summary: 'Update menu item override availability and price',
        value: {
          isAvailable: true,
          priceOverride: 4.99
        }
      }
    }
  })
  @Patch('overrides/:id')
  updateMenuItemOverride(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemOverrideDto: UpdateMenuItemOverrideDto,
  ) {
    return this.menuService.updateMenuItemOverride(id, updateMenuItemOverrideDto);
  }

  @ApiOperation({ summary: 'Delete a menu item override' })
  @ApiParam({ name: 'id', description: 'The ID of the menu item override' })
  @ApiResponse({ status: 200, description: 'The menu item override has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Menu item override not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete('overrides/:id')
  removeMenuItemOverride(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.removeMenuItemOverride(id);
  }
} 