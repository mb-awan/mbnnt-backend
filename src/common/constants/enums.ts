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

export enum CommonPermissions {
  // common permissions
  GET_ME = 'get_me',
  UPDATE_ME = 'update_me',
  DELETE_ME = 'delete_me',
  UPLOAD_PROFILE_PIC = 'upload_profile_pic',
  REQUEST_PASSWORD_UPDATE = 'request_password_update',
  UPDATE_PASSWORD = 'update_password',
  ENABLE_TWO_FACTOR_AUTHENTICATION = 'enable_two_factor_authentication',
  DISABLE_TWO_FACTOR_AUTHENTICATION = 'disable_two_factor_authentication',
  REQUEST_EMAIL_VERIFICATION_OTP = 'request_email_verification_otp',
  VERIFY_EMAIL = 'verify_email',
  REQUEST_PHONE_VERIFICATION_OTP = 'request_phone_verification_otp',
  VERIFY_PHONE = 'verify_phone',

  // news letter
  SUBSCRIBE_NEWS_LETTER = 'subscribe_news_letter',
  UNSUBSCRIBE_NEWS_LETTER = 'unsubscribe_news_letter',

  // feedback
  CREATE_FEEDBACK = 'create_feedback',
  READ_ALL_FEEDBACK = 'read_all_feedback',
  READ_FEEDBACK = 'read_feedback',
  UPDATE_FEEDBACK = 'update_feedback',
  DELETE_FEEDBACK = 'delete_feedback',

  // faq
  CREATE_FAQ = 'create_faq',
  READ_ALL_FAQ = 'read_all_faq',
  READ_FAQ = 'read_faq',
  UPDATE_FAQ = 'update_faq',
  DELETE_FAQ = 'delete_faq',

  // contact us
  CREATE_CONTACT_US = 'create_contact_us',
  READ_CONTACT_US = 'read_contact_us',
  READ_ALL_CONTACT_US = 'read_all_contact_us',
  UPDATE_CONTACT_US = 'update_contact_us',
  DELETE_CONTACT_US = 'delete_contact_us',

  // notification
  CREATE_NOTIFICATION = 'create_notification',
  READ_ALL_NOTIFICATION = 'read_all_notification',
  READ_NOTIFICATION = 'read_notification',
  UPDATE_NOTIFICATION = 'update_notification',
  DELETE_NOTIFICATION = 'delete_notification',

  // blogCategory
  CREATE_BLOG_CATEGORY = 'create_blog_category',
  READ_ALL_BLOG_CATEGORY = 'read_all_blog_category',
  READ_BLOG_CATEGORY = 'read_blog_category',
  UPDATE_BLOG_CATEGORY = 'update_blog_category',
  DELETE_BLOG_CATEGORY = 'delete_blog_category',
  // blog
  CREATE_BLOG = 'create_blog',
  READ_ALL_BLOG = 'read_all_blog',
  READ_BLOG = 'read_blog',
  UPDATE_BLOG = 'update_blog',
  DELETE_BLOG = 'delete_blog',

  // plan
  CREATE_PLAN = 'create_plan',
  READ_ALL_PLAN = 'read_all_plan',
  READ_PLAN = 'read_plan',
  UPDATE_PLAN = 'update_plan',
  DELETE_PLAN = 'delete_plan',
}

export enum VisitorPermissions {
  READ_VISITOR_CONTENT = 'read_visitor_content',
}

export enum StudentPermissions {
  READ_COURSE_MATERIAL = 'read_course_material',
  SUBMIT_ASSIGNMENT = 'submit_assignment',
  READ_ASSIGNMENT = 'read_assignment',
}

export enum TeacherPermissions {
  CREATE_ASSIGNMENT = 'create_assignment',
  GRADE_ASSIGNMENT = 'grade_assignment',
}

export enum AdminPermissions {
  // user
  CREATE_USER = 'create_user',
  READ_ALL_USERS = 'read_all_users',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  BLOCK_USER = 'block_user',

  // role
  CREATE_ROLE = 'create_role',
  READ_ALL_ROLES = 'read_all_roles',
  READ_ROLE = 'read_role',
  UPDATE_ROLE = 'update_role',
  DELETE_ROLE = 'delete_role',
  ASSIGN_NEW_PERMISSION_ROLE = 'assign_new_permission_role',
  CHANGE_USER_ROLE = 'change_user_role',

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

  // subscriptions
  CREATE_SUBSCRIPTION = 'create_subscription',
  READ_ALL_SUBSCRIPTION = 'get_all_subscriptions',
  READ_ANY_SUBSCRIPTION = 'get_any_subscription',
  UPDATE_SUBSCRIPTION = 'update_subscription',
  DELETE_SUBSCRIPTION = 'delete_subscription',

  // siteInfo
  CREATE_SITEINFO = 'create_siteinfo',
  READ_SITEINFO = 'get_siteinfo',
  UPDATE_SITEINFO = 'update_siteinfo',
  DELETE_SITEINFO = 'delete_siteinfo',

  // email

  CREATE_EMAIL = 'create_email',
  READ_ALL_EMAIL = 'read_all_email',
  READ_EMAIL = 'read_email',
  UPDATE_EMAIL = 'update_email',
  DELETE_EMAIL = 'delete_email',
}

export enum SubAdminPermissions {
  READ_ALL_USERS = 'read_all_users',
}

// Notification Types ENUM
export enum NotificationTypes {
  MESSAGE = 'message',
  ALERT = 'alert',
  REMINDER = 'reminder',
  SYSTEM = 'system',
}
