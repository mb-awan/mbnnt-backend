export enum UserRoles {
  ADMIN = 'admin',
  SUB_ADMIN = 'subAdmin',
  VISITOR = 'visitor',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export enum UserStatus {
  ACTIVE = 'active', // Active user
  DELETED = 'deleted', // Deleted user itself
  BLOCKED = 'blocked', // Blocked by admin
}

export enum VisitorPermissions {
  READ_VISITOR_CONTENT = 'read_visitor_content',
}

export enum StudentPermissions {
  READ_COURSE_MATERIAL = 'read_course_material',
  SUBMIT_ASSIGNMENT = 'submit_assignment',
}

export enum TeacherPermissions {
  CREATE_ASSIGNMENT = 'create_assignment',
  GRADE_ASSIGNMENT = 'grade_assignment',
}

export enum AdminPermissions {
  READ_VISITOR_CONTENT = 'read_visitor_content',
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  DELETE_ANY_USER = 'delete_any_user',
  BLOCK_ANY_USER = 'block_any_user',
  UPDATE_ANY_USER = 'update_any_user',
  READ_ALL_USER = 'read_all_user',
  READ_ANY_USER = 'read_any_user',
}
