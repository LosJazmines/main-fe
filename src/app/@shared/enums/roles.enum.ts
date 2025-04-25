export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  ENCARGADO = 'ENCARGADO'
}

export const RoleLabels: Record<UserRoles, string> = {
  [UserRoles.ADMIN]: 'Administrador',
  [UserRoles.USER]: 'Usuario',
  [UserRoles.ENCARGADO]: 'Encargado'
}; 