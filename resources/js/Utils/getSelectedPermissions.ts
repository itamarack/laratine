import { Permission } from "@/Pages/RolesPermissions/permissions";

export const getSelectedPermissions = (permissions: Permission[]): string[] => {
  if (!Array.isArray(permissions)) return [];

  return permissions.flatMap((permission: Permission) => {
    return permission.permission
      .filter(subPermission => permission.checked && subPermission.checked)
      .map(subPermission => subPermission.value)
  }
  );
};
