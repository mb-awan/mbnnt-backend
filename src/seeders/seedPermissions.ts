import { AdminPermissions, StudentPermissions, TeacherPermissions, VisitorPermissions } from '@/common/constants/enums';
import { Permission } from '@/common/models/permissions';

const seedPermissions = async () => {
  const permissions = [
    ...Object.values(VisitorPermissions),
    ...Object.values(StudentPermissions),
    ...Object.values(TeacherPermissions),
    ...Object.values(AdminPermissions),
  ];

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
};

export default seedPermissions;
