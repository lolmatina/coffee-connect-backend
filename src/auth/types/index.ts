export type UserRole = 'SUPER_ADMIN' | 'COFFEE_SHOP_OWNER' | 'COFFEE_SHOP_MANAGER' | 'COFFEE_SHOP_STAFF';

export type Token = {
    accessToken: string;
    refreshToken: string;
}

export type User = {
    id: number;
    email: string;
    role: UserRole;
    UserProfile: {
        firstName: string;
        lastName: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

