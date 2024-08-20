import { Permission, PermissionGroup } from './permission';

export interface User {
  id: number;
  username: string;
  is_active: boolean;
  is_admin: boolean;
  date_created: string;
  scopes: string[];
  permissions: Permission[];
  permission_groups: PermissionGroup[];
}
