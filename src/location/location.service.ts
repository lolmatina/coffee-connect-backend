import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto) {
    return this.prisma.location.create({
      data: createLocationDto,
    });
  }

  async findAll(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
      },
    });

    if (!user && userId !== -1) {
      throw new NotFoundException('User not found');
    }

    if (user && (user.role === 'COFFEE_SHOP_STAFF' || user.role === 'COFFEE_SHOP_MANAGER')) {
      throw new ForbiddenException('You are not authorized to access this resource');
    } else if (user && user.role === 'COFFEE_SHOP_OWNER') {
      return this.prisma.location.findMany({
        where: {
          Brand: {
            ownerId: userId,
          },
        },
        include: {
          Brand: true,
          LocationStaff: {
            include: {
              staff: {
                select: { id: true, email: true, role: true, UserProfile: true },
              },
            },
          },
          manager: {
            select: {
              id: true,
              email: true,
              role: true,
              UserProfile: true,
            },
          },
        },
      });
    }

    
    return this.prisma.location.findMany({
      include: {
        Brand: true,
        LocationStaff: {
          include: {
            staff: {
              select: { id: true, email: true, role: true, UserProfile: true },
            },
          },
        },
        manager: {
          select: {
            id: true,
            email: true,
            role: true,
            UserProfile: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        Brand: true,
        manager: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        LocationStaff: {
          include: {
            staff: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    try {
      return await this.prisma.location.update({
        where: { id },
        data: updateLocationDto,
      });
    } catch (error) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.location.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
  }

  async findByBrand(brandId: number) {
    return this.prisma.location.findMany({
      where: {
        BrandId: brandId,
      },
      include: {
        manager: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findLocationUsers(id: number) {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        LocationStaff: {
          include: {
            staff: {
              select: {
                id: true,
                email: true,
                role: true,
                UserProfile: true,
              },
            },
          },
        },
      },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    // Construct a response with separate arrays for staff and manager
    const staffUsers = location.LocationStaff.map(ls => ls.staff);
    const response = staffUsers

    return response;
  }
}