"use client";

import { useAuth } from "../context/auth.context";
import { PermissionEnum, RoleType } from "../types/user.types";

const rolePermissions: Record<RoleType, PermissionEnum[]> = {
  [RoleType.ADMIN]: [
    PermissionEnum.VIEW_RESTAURANTS,
    PermissionEnum.CREATE_ORDER,
    PermissionEnum.PLACE_ORDER,
    PermissionEnum.CANCEL_ORDER,
    PermissionEnum.UPDATE_PAYMENT,
  ],
  [RoleType.MANAGER]: [
    PermissionEnum.VIEW_RESTAURANTS,
    PermissionEnum.CREATE_ORDER,
    PermissionEnum.PLACE_ORDER,
    PermissionEnum.CANCEL_ORDER,
  ],
  [RoleType.MEMBER]: [
    PermissionEnum.VIEW_RESTAURANTS,
    PermissionEnum.CREATE_ORDER,
  ],
};

export function usePermission() {
  const { user } = useAuth();

  const hasPermission = (permission: PermissionEnum): boolean => {
    if (!user) return false;

    return user.userRoles.some((userRole) =>
      rolePermissions[userRole.role.name]?.includes(permission),
    );
  };

  return { hasPermission };
}
