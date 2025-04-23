import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // Menu Template operations
  async createMenuTemplate(createMenuTemplateDto: CreateMenuTemplateDto) {
    return this.prisma.menuTemplate.create({
      data: {
        name: createMenuTemplateDto.name,
        brandId: createMenuTemplateDto.brandId,
      },
      include: {
        brand: true,
      },
    });
  }

  async findAllMenuTemplates() {
    return this.prisma.menuTemplate.findMany({
      include: {
        brand: true,
        items: {
          include: {
            variants: true,
          },
        },
      },
    });
  }

  async findMenuTemplatesByBrand(brandId: number) {
    return this.prisma.menuTemplate.findMany({
      where: {
        brandId,
      },
      include: {
        brand: true,
        items: {
          include: {
            variants: true,
            TemplateItemTag: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });
  }

  async findOneMenuTemplate(id: number) {
    const menuTemplate = await this.prisma.menuTemplate.findUnique({
      where: { id },
      include: {
        brand: true,
        items: {
          include: {
            variants: true,
            TemplateItemTag: {
              include: {
                tag: true,
              },
            },
            TemplateItemAddon: {
              include: {
                addon: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
        Addon: {
          include: {
            category: true,
          },
        },
        AddonCategory: true,
      },
    });

    if (!menuTemplate) {
      throw new NotFoundException(`Menu template with ID ${id} not found`);
    }

    return menuTemplate;
  }

  async updateMenuTemplate(id: number, updateMenuTemplateDto: UpdateMenuTemplateDto) {
    try {
      return await this.prisma.menuTemplate.update({
        where: { id },
        data: updateMenuTemplateDto,
        include: {
          brand: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Menu template with ID ${id} not found`);
    }
  }

  async removeMenuTemplate(id: number) {
    try {
      return await this.prisma.menuTemplate.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Menu template with ID ${id} not found`);
    }
  }

  // Template Item operations
  async createTemplateItem(createTemplateItemDto: CreateTemplateItemDto) {
    const { variants, ...itemData } = createTemplateItemDto;

    return this.prisma.templateItem.create({
      data: {
        ...itemData,
        variants: variants ? {
          create: variants,
        } : undefined,
      },
      include: {
        variants: true,
        template: true,
      },
    });
  }

  async findAllTemplateItems() {
    return this.prisma.templateItem.findMany({
      include: {
        variants: true,
        template: true,
        TemplateItemTag: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findTemplateItemsByTemplate(templateId: number) {
    return this.prisma.templateItem.findMany({
      where: {
        templateId,
      },
      include: {
        variants: true,
        TemplateItemTag: {
          include: {
            tag: true,
          },
        },
        TemplateItemAddon: {
          include: {
            addon: true,
          },
        },
      },
    });
  }

  async findOneTemplateItem(id: number) {
    const templateItem = await this.prisma.templateItem.findUnique({
      where: { id },
      include: {
        variants: true,
        template: true,
        TemplateItemTag: {
          include: {
            tag: true,
          },
        },
        TemplateItemAddon: {
          include: {
            addon: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!templateItem) {
      throw new NotFoundException(`Template item with ID ${id} not found`);
    }

    return templateItem;
  }

  async updateTemplateItem(id: number, updateTemplateItemDto: UpdateTemplateItemDto) {
    try {
      const { variants, ...itemData } = updateTemplateItemDto;
      
      return await this.prisma.templateItem.update({
        where: { id },
        data: {
          ...itemData,
        },
        include: {
          variants: true,
          template: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Template item with ID ${id} not found`);
    }
  }

  async removeTemplateItem(id: number) {
    try {
      return await this.prisma.templateItem.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Template item with ID ${id} not found`);
    }
  }

  // Menu operations
  async createMenu(createMenuDto: CreateMenuDto) {
    return this.prisma.menu.create({
      data: createMenuDto,
      include: {
        location: true,
        template: true,
      },
    });
  }

  async findAllMenus() {
    return this.prisma.menu.findMany({
      include: {
        location: true,
        template: {
          include: {
            items: {
              include: {
                variants: true,
              },
            },
          },
        },
        overrides: true,
      },
    });
  }

  async findMenuByLocation(locationId: number) {
    const menu = await this.prisma.menu.findFirst({
      where: {
        locationId,
      },
      include: {
        template: {
          include: {
            items: {
              include: {
                variants: true,
                TemplateItemTag: {
                  include: {
                    tag: true,
                  },
                },
                TemplateItemAddon: {
                  include: {
                    addon: {
                      include: {
                        category: true,
                      },
                    },
                  },
                },
              },
            },
            Addon: {
              include: {
                category: true,
              },
            },
            AddonCategory: true,
          },
        },
        overrides: {
          include: {
            templateItem: true,
          },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu for location with ID ${locationId} not found`);
    }

    return menu;
  }

  async findOneMenu(id: number) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: {
        location: true,
        template: {
          include: {
            items: {
              include: {
                variants: true,
              },
            },
          },
        },
        overrides: true,
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return menu;
  }

  async updateMenu(id: number, updateMenuDto: UpdateMenuDto) {
    try {
      return await this.prisma.menu.update({
        where: { id },
        data: updateMenuDto,
        include: {
          location: true,
          template: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
  }

  async removeMenu(id: number) {
    try {
      return await this.prisma.menu.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
  }

  // Menu Item Override operations
  async createMenuItemOverride(createMenuItemOverrideDto: CreateMenuItemOverrideDto) {
    return this.prisma.menuItemOverride.create({
      data: createMenuItemOverrideDto,
      include: {
        menu: true,
        templateItem: true,
      },
    });
  }

  async findMenuItemOverridesByMenu(menuId: number) {
    return this.prisma.menuItemOverride.findMany({
      where: {
        menuId,
      },
      include: {
        templateItem: {
          include: {
            variants: true,
          },
        },
      },
    });
  }

  async updateMenuItemOverride(id: number, updateMenuItemOverrideDto: UpdateMenuItemOverrideDto) {
    try {
      return await this.prisma.menuItemOverride.update({
        where: { id },
        data: updateMenuItemOverrideDto,
        include: {
          menu: true,
          templateItem: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Menu item override with ID ${id} not found`);
    }
  }

  async removeMenuItemOverride(id: number) {
    try {
      return await this.prisma.menuItemOverride.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Menu item override with ID ${id} not found`);
    }
  }
} 