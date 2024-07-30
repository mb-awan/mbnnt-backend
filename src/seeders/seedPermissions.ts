import {
  AdminPermissions,
  CommonPermissions,
  StudentPermissions,
  SubAdminPermissions,
  TeacherPermissions,
  VisitorPermissions,
} from '@/common/constants/enums';
import { Permission } from '@/common/models/permissions';

const seedPermissions = async () => {
  try {
    const permissions = [
      ...Object.values(CommonPermissions),
      ...Object.values(VisitorPermissions),
      ...Object.values(StudentPermissions),
      ...Object.values(TeacherPermissions),
      ...Object.values(SubAdminPermissions),
      ...Object.values(AdminPermissions),
    ];

    console.log('Seeding permissions...');

    await Promise.all(
      permissions.map((permission) =>
        Permission.findOneAndUpdate(
          { name: permission },
          { name: permission, description: `can ${permission.replace(/_/g, ' ')}` },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );

    console.log('Permissions seeded!');
  } catch (err) {
    console.log(err);
    throw new Error('Something went wrong while seeding permissions');
  }
};

export default seedPermissions;
