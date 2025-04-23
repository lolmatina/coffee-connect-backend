import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, AssignUserToBrandDto, AssignUserToLocationDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findAll(currentUserId: number, role: string, roleFilter?: string) {
        const roleFilterCondition = roleFilter ? { role: roleFilter as any } : {};

        if (role === 'SUPER_ADMIN') {
            return this.prisma.user.findMany({
                where: roleFilterCondition,
                include: {
                    UserProfile: true,
                },
                orderBy: {
                    role: 'asc',
                },
            });
        }

        if (role === 'COFFEE_SHOP_OWNER') {
            const brands = await this.prisma.brand.findMany({
                where: { ownerId: currentUserId },
                select: { id: true },
            });

            const brandIds = brands.map(brand => brand.id);

            const locations = await this.prisma.location.findMany({
                where: { BrandId: { in: brandIds } },
                select: { id: true },
            });

            const locationIds = locations.map(loc => loc.id);

            const staffIds = await this.prisma.locationStaff.findMany({
                where: { locationId: { in: locationIds } },
                select: { staffId: true },
            });

            return this.prisma.user.findMany({
                where: {
                    ...roleFilterCondition,
                    OR: [
                        { id: { in: staffIds.map(staff => staff.staffId) } },
                        { Location: { some: { BrandId: { in: brandIds } } } },
                        { id: currentUserId }
                    ]
                },
                include: {
                    UserProfile: true,
                },
                orderBy: {
                    role: 'asc',
                },
            });
        }

        if (role === 'COFFEE_SHOP_MANAGER') {
            const locations = await this.prisma.location.findMany({
                where: { managerId: currentUserId },
                select: { id: true },
            });

            const locationIds = locations.map(loc => loc.id);

            const staffIds = await this.prisma.locationStaff.findMany({
                where: { locationId: { in: locationIds } },
                select: { staffId: true },
            });

            return this.prisma.user.findMany({
                where: {
                    ...roleFilterCondition,
                    OR: [
                        { id: { in: staffIds.map(staff => staff.staffId) } },
                        { id: currentUserId }
                    ]
                },
                include: {
                    UserProfile: true,
                },
                orderBy: {
                    role: 'asc',
                },
            });
        }

        return this.prisma.user.findMany({
            where: {
                id: currentUserId,
                ...roleFilterCondition
            },
            include: {
                UserProfile: true,
            },
            orderBy: {
                role: 'asc',
            },
        });
    }

    async findOne(id: number, currentUserId: number, role: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                UserProfile: true,
                Brand: true,
                Location: {
                    select: {
                        id: true,
                        name: true,
                        BrandId: true,
                    },
                },
                LocationStaff: {
                    include: {
                        location: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        if (role === 'SUPER_ADMIN') {
            return user;
        }

        if (role === 'COFFEE_SHOP_OWNER') {
            const ownerBrands = await this.prisma.brand.findMany({
                where: { ownerId: currentUserId },
                select: { id: true },
            });

            const brandIds = ownerBrands.map(brand => brand.id);

            const userLocations = user.LocationStaff.map(staff => staff.location);
            const userBrandIds = [...new Set([
                ...userLocations.map(loc => loc.BrandId),
                ...user.Location.map(loc => loc.BrandId)
            ])];

            const hasAccess = userBrandIds.some(brandId => brandIds.includes(brandId)) || id === currentUserId;

            if (!hasAccess) {
                throw new ForbiddenException('Not authorized to access this user');
            }

            return user;
        }

        if (role === 'COFFEE_SHOP_MANAGER') {
            const managerLocations = await this.prisma.location.findMany({
                where: { managerId: currentUserId },
                select: { id: true },
            });

            const locationIds = managerLocations.map(loc => loc.id);

            const userLocations = user.LocationStaff.map(staff => staff.location.id);

            const hasAccess = userLocations.some(locId => locationIds.includes(locId)) || id === currentUserId;

            if (!hasAccess) {
                throw new ForbiddenException('Not authorized to access this user');
            }

            return user;
        }

        if (id !== currentUserId) {
            throw new ForbiddenException('Not authorized to access this user');
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto, currentUserId: number, role: string) {
        await this.checkUserAccessPermission(id, currentUserId, role);

        const { firstName, lastName, phoneNumber } = updateUserDto;

        try {
            if (firstName || lastName || phoneNumber) {
                await this.prisma.userProfile.update({
                    where: { userId: id },
                    data: {
                        ...(firstName && { firstName }),
                        ...(lastName && { lastName }),
                        ...(phoneNumber !== undefined && { phoneNumber })
                    }
                });
            }

            const updated = await this.prisma.user.findUnique({
                where: { id },
                include: {
                    UserProfile: true
                }
            });

            if (!updated) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            return updated;
        } catch (error) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }

    async remove(id: number, currentUserId: number, role: string) {
        if (role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Not authorized to delete users');
        }

        try {
            await this.prisma.userProfile.deleteMany({
                where: { userId: id }
            });

            return await this.prisma.user.delete({
                where: { id }
            });
        } catch (error) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }

    async assignToBrand(dto: AssignUserToBrandDto, currentUserId: number, role: string) {
        if (role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Not authorized to assign users to brands');
        }

        const { userId, brandId } = dto;

        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        if (user.role !== 'COFFEE_SHOP_OWNER') {
            throw new ForbiddenException('Only COFFEE_SHOP_OWNER can be assigned to brands');
        }

        const brand = await this.prisma.brand.findUnique({
            where: { id: brandId }
        });

        if (!brand) {
            throw new NotFoundException(`Brand with ID ${brandId} not found`);
        }

        return this.prisma.brand.update({
            where: { id: brandId },
            data: { ownerId: userId }
        });
    }

    async assignToLocation(dto: AssignUserToLocationDto, currentUserId: number, role: string) {
        const { userId, locationId, isManager } = dto;

        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const location = await this.prisma.location.findUnique({
            where: { id: locationId },
            include: { Brand: true }
        });

        if (!location) {
            throw new NotFoundException(`Location with ID ${locationId} not found`);
        }

        if (role === 'SUPER_ADMIN') {
        } else if (role === 'COFFEE_SHOP_OWNER') {
            const ownerBrands = await this.prisma.brand.findMany({
                where: { ownerId: currentUserId },
                select: { id: true }
            });

            if (!ownerBrands.some(brand => brand.id === location.BrandId)) {
                throw new ForbiddenException('Not authorized to assign users to this location');
            }
        } else {
            throw new ForbiddenException('Not authorized to assign users to locations');
        }

        if (isManager) {
            if (user.role !== 'COFFEE_SHOP_MANAGER') {
                throw new ForbiddenException('Only COFFEE_SHOP_MANAGER can be assigned as managers');
            }

            return this.prisma.location.update({
                where: { id: locationId },
                data: { managerId: userId }
            });
        } else {
            if (user.role !== 'COFFEE_SHOP_STAFF') {
                throw new ForbiddenException('Only COFFEE_SHOP_STAFF can be assigned as staff');
            }

            const existingAssignment = await this.prisma.locationStaff.findFirst({
                where: {
                    locationId,
                    staffId: userId
                }
            });

            if (existingAssignment) {
                return { message: 'User already assigned to this location' };
            }

            return this.prisma.locationStaff.create({
                data: {
                    locationId,
                    staffId: userId
                }
            });
        }
    }

    private async checkUserAccessPermission(targetUserId: number, currentUserId: number, role: string) {
        if (targetUserId === currentUserId || role === 'SUPER_ADMIN') {
            return true;
        }

        const targetUser = await this.prisma.user.findUnique({
            where: { id: targetUserId },
            include: {
                LocationStaff: {
                    include: {
                        location: {
                            include: {
                                Brand: true
                            }
                        }
                    }
                },
                Location: {
                    include: {
                        Brand: true
                    }
                }
            }
        });

        if (!targetUser) {
            throw new NotFoundException(`User with ID ${targetUserId} not found`);
        }

        if (role === 'COFFEE_SHOP_OWNER') {
            const ownerBrands = await this.prisma.brand.findMany({
                where: { ownerId: currentUserId },
                select: { id: true }
            });

            const brandIds = ownerBrands.map(brand => brand.id);

            const userBrands = [
                ...targetUser.LocationStaff.map(staff => staff.location.Brand.id),
                ...targetUser.Location.map(loc => loc.Brand.id)
            ];

            if (!userBrands.some(brandId => brandIds.includes(brandId))) {
                throw new ForbiddenException('Not authorized to access this user');
            }

            return true;
        }

        if (role === 'COFFEE_SHOP_MANAGER') {
            const managerLocations = await this.prisma.location.findMany({
                where: { managerId: currentUserId },
                select: { id: true }
            });

            const locationIds = managerLocations.map(loc => loc.id);

            const userLocations = targetUser.LocationStaff.map(staff => staff.location.id);

            if (!userLocations.some(locId => locationIds.includes(locId))) {
                throw new ForbiddenException('Not authorized to access this user');
            }

            return true;
        }

        throw new ForbiddenException('Not authorized to access this user');
    }
} 