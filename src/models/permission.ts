export interface Permission {
  name: string;
  description: string;
  source_id: number | null;
}

export interface PermissionGroup {
  name: string;
  label: string;
  description: string;
  permissions: Permission[]
}
