export enum UserRoles {
  ADMIN = 'admin',
  SubAdmin = 'subadmin',
  VISITOR = 'visitor',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export enum UserStatus {
  ACTIVE = 'active', // Active user
  DELETED = 'deleted', // Deleted user itself
  BLOCKED = 'blocked', // Blocked by admin
}
