import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto, role: string, userId: number) {
    if (role !== 'COFFEE_SHOP_OWNER' && role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('You are not authorized to create a brand');
    }

    if (role === 'SUPER_ADMIN' && createBrandDto.ownerId) {
      return this.prisma.brand.create({
        data: {
          ...createBrandDto,
          ownerId: createBrandDto.ownerId,
        },
      });
    }

    return this.prisma.brand.create({
      data: {
        ...createBrandDto,
        ownerId: userId,
      },
    });
  }

  async findAll(role: string, userId: number) {
    switch (role) {
      case 'SUPER_ADMIN':
        return this.prisma.brand.findMany();
      case 'COFFEE_SHOP_OWNER':
        return this.prisma.brand.findMany({
          where: {
          ownerId: userId,
        },
      });
      case 'COFFEE_SHOP_STAFF':
        const staff = await this.prisma.locationStaff.findMany({
          include: {
            location: true,
          },
          where: {
            staffId: userId,
          },
        });

        if (!staff) {
          throw new NotFoundException('Staff not found');
        }

        return this.prisma.brand.findMany({
          where: {
            id: { in: staff.map((staff) => staff.location.BrandId) },
          },
        }); 
      case 'COFFEE_SHOP_MANAGER':
        const manager = await this.prisma.location.findMany({
          include: {
            Brand: true,
          },
          where: {
            managerId: userId,
          },
        });
        return this.prisma.brand.findMany({
          where: {
            id: { in: manager.map((manager) => manager.Brand.id) },
          },
        });
      default:
        throw new ForbiddenException('You are not authorized to create a brand');
    }
  }

  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        Location: true,
      },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, role: string) {
    if (role !== 'COFFEE_SHOP_OWNER') {
      throw new ForbiddenException('You are not authorized to update a brand');
    }
    try {
      return await this.prisma.brand.update({
        where: { id },
        data: updateBrandDto,
      });
    } catch (error) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
  }

  async remove(id: number, role: string) {
    if (role !== 'COFFEE_SHOP_OWNER') {
      throw new ForbiddenException('You are not authorized to delete a brand');
    }
    try {
      return await this.prisma.brand.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
  }
}