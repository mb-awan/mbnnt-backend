export enum UserRoles {
  ADMIN = 'admin',
  SUB_ADMIN = 'subAdmin',
  VISITOR = 'visitor',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export const faqCategoryEnum = ['General', 'Billing', 'Technical Support', 'Product'] as const;
export type FaqCategory = (typeof faqCategoryEnum)[number];

export enum FeedbackTypeEnum {
  Complaint = 'Complaint',
  Review = 'Review',
  Suggestion = 'Suggestion',
}

export enum UserStatus {
  ACTIVE = 'active', // Active user
  DELETED = 'deleted', // Deleted user itself
  BLOCKED = 'blocked', // Blocked by admin
}

export enum NewsLetterStatus {
  SUBSCRIBED = 'subscribed', // Active user
  UNSUBSCRIBED = 'unSubscribed',
}

export enum VisitorPermissions {
  READ_VISITOR_CONTENT = 'read_visitor_content',

  // me
  GET_ME = 'get_me',
  UPDATE_ME = 'update_me',
  DELETE_ME = 'delete_me',
  UPLOAD_PROFILE_PIC = 'upload_profile_pic',
  REQUEST_PASSWORD_UPDATE = 'request_password_update',
}

export enum StudentPermissions {
  READ_COURSE_MATERIAL = 'read_course_material',
  SUBMIT_ASSIGNMENT = 'submit_assignment',
  READ_ASSIGNMENT = 'read_assignment',

  // me
  GET_ME = 'get_me',
  UPDATE_ME = 'update_me',
  DELETE_ME = 'delete_me',
  UPLOAD_PROFILE_PIC = 'upload_profile_pic',
  REQUEST_PASSWORD_UPDATE = 'request_password_update',
}

export enum TeacherPermissions {
  CREATE_ASSIGNMENT = 'create_assignment',
  GRADE_ASSIGNMENT = 'grade_assignment',

  // me
  GET_ME = 'get_me',
  UPDATE_ME = 'update_me',
  DELETE_ME = 'delete_me',
  UPLOAD_PROFILE_PIC = 'upload_profile_pic',
  REQUEST_PASSWORD_UPDATE = 'request_password_update',
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

  // role
  CREATE_ROLE = 'create_role',
  READ_ALL_ROLES = 'read_all_roles',
  READ_ROLE = 'read_role',
  UPDATE_ROLE = 'update_role',
  DELETE_ROLE = 'delete_role',

  // permission
  CREATE_PERMISSION = 'create_permission',
  READ_ALL_PERMISSIONS = 'read_all_permissions',
  READ_PERMISSION = 'read_permission',
  UPDATE_PERMISSION = 'update_permission',
  DELETE_PERMISSION = 'delete_permission',

  // news letter
  CREATE_NEWS_LETTER = 'create_news_letter',
  READ_ALL_NEWS_LETTERS = 'get_all_news_letters',
  READ_ANY_NEWS_LETTER = 'get_any_news_letter',
  UPDATE_NEWS_LETTER = 'update_news_letter',
  DELETE_NEWS_LETTER = 'delete_news_letter',
}

// Notification Types ENUM
export enum NotificationTypes {
  MESSAGE = 'message',
  ALERT = 'alert',
  REMINDER = 'reminder',
  SYSTEM = 'system',
}
