import { StudentPermissions, TeacherPermissions, UserRoles, VisitorPermissions } from '@/common/constants/enums';
import { Permission } from '@/common/models/permissions';
import { Role } from '@/common/models/roles';

const seedRoles = async () => {
  const permissions = await Permission.find({});
  const permissionMap = permissions.reduce(
    (map, perm) => {
      map[perm.name] = perm._id;
      return map;
    },
    {} as { [key: string]: any }
  );

  const roles = [
    { name: UserRoles.ADMIN, permissions: Object.values(permissionMap) },
    {
      name: UserRoles.SUB_ADMIN,
      permissions: [],
    },
    {
      name: UserRoles.VISITOR,
      permissions: Object.values(VisitorPermissions).map((perm) => permissionMap[perm]),
    },
    {
      name: UserRoles.STUDENT,
      permissions: Object.values(StudentPermissions).map((perm) => permissionMap[perm]),
    },
    {
      name: UserRoles.TEACHER,
      permissions: Object.values(TeacherPermissions).map((perm) => permissionMap[perm]),
    },
  ];

  await Promise.all(
    roles.map((role) =>
      Role.findOneAndUpdate(
        { name: role.name },
        { name: role.name, permissions: role.permissions },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );

  console.log('Roles seeded!');
};

export default seedRoles;
