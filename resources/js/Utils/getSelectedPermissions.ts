import { Permission } from "@/types";

export const getSelectedPermissions = (permissions: Permission[]): string[] => {
  if (!Array.isArray(permissions)) return [];

  return permissions.flatMap((permission: Permission) => {
    return permission.permission
      .filter(subPermission => permission.active && subPermission.active)
      .map(subPermission => subPermission.name)
  });
};
